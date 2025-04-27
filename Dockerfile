# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy build artifacts and dependencies from build stage
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./
COPY --from=builder --chown=nextjs:nodejs /app/postcss.config.mjs ./
COPY --from=builder --chown=nextjs:nodejs /app/tailwind.config.ts ./

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD node -e "try { require('http').request({ host: 'localhost', port: process.env.PORT || 3000, path: '/', timeout: 2000 }, (res) => { process.exit(res.statusCode >= 200 && res.statusCode < 400 ? 0 : 1); }).on('error', () => process.exit(1)).end(); } catch (e) { process.exit(1); }"

# Start the application
CMD ["npm", "start"] 