# Build stage
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Nginx stage
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy React build output
COPY --from=build /app/dist /usr/share/nginx/html

# Default port = prod (6082). Override at runtime for dev.
ENV NGINX_PORT=6082

# Replace ${NGINX_PORT} in nginx config at container startup
CMD ["/bin/sh", "-c", "envsubst '${NGINX_PORT}' < /etc/nginx/conf.d/default.conf > /tmp/default.conf && cp /tmp/default.conf /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

EXPOSE 6082
EXPOSE 6091