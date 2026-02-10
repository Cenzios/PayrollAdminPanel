# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build-time env vars
ARG VITE_DEBUG_MESSAGE
ARG VITE_API_BASE_URL

# Make them available to Vite
ENV VITE_DEBUG_MESSAGE=$VITE_DEBUG_MESSAGE
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
