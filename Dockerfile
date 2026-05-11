# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runner stage (No Nginx)
FROM node:18-alpine

WORKDIR /app

# Copy the build output from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the custom server script
COPY server.mjs ./

# Set environment variables (defaults)
ENV PORT=80
ENV VITE_API_BASE_URL=https://payrolladminbackend.cenzios.com/api
ENV VITE_DEBUG_MESSAGE="Production Build"

# Expose the port the server runs on
EXPOSE 80

# Run the Node server
CMD ["node", "server.mjs"]