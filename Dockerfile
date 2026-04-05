FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Remove dev dependencies
RUN npm prune --production && npm cache clean --force

# Set environment variables
ENV NODE_ENV=production
ENV NWO_API_KEY=${NWO_API_KEY}

# Expose port (if needed for monitoring)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "console.log('OK')" || exit 1

# Run the server
CMD ["node", "dist/index.js"]
