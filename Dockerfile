# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Add build-time environment variables for Vite
ARG VITE_API_BASE_URL
ARG VITE_DEBUG_MESSAGE
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_DEBUG_MESSAGE=$VITE_DEBUG_MESSAGE

# Build the application
RUN npm run build

# Runner stage
FROM nginx:stable-alpine

# Copy the build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 6091

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
