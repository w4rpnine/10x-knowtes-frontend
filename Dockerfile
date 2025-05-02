# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Set environment variable to disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies without frozen lockfile check
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Build application with output file tracing enabled
RUN pnpm build

# Remove development dependencies after build to reduce layer size
RUN pnpm prune --prod

# Production stage - using minimal alpine instead of node:alpine
FROM alpine:3.19 AS runner

# Install Node.js and dependencies needed for runtime
RUN apk add --no-cache nodejs npm bash

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy only the necessary built files using Next.js output tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Clean npm cache and any other temporary files
RUN rm -rf /tmp/* /var/cache/apk/*

# Make sure the entrypoint script can be executed by the nextjs user
RUN chown nextjs:nodejs /entrypoint.sh

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 80

# Use the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]

# Start the application
CMD ["node", "server.js"] 