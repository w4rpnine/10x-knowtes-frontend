#!/bin/sh
set -e

# Inject environment variables into the env-config.js file
sed -i "s|__NEXT_PUBLIC_API_URL__|$NEXT_PUBLIC_API_URL|g" /app/public/env-config.js
sed -i "s|__INTERNAL_API_URL__|$INTERNAL_API_URL|g" /app/public/env-config.js

# Start the application
exec "$@" 