# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies including devDependencies
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Stage 2: Create the production image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Set the working directory to a non-root directory
WORKDIR /app

# Change ownership of the app directory
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Command to run the application
CMD ["node", "dist/server.js"]
