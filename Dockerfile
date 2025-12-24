# Simple Dockerfile for Strapi (Alternative)
# Single-stage build - easier to debug, slightly larger image

FROM node:20-alpine

WORKDIR /app

# Install all required dependencies
RUN apk add --no-cache \
    build-base \
    gcc \
    g++ \
    make \
    autoconf \
    automake \
    libtool \
    pkgconfig \
    zlib-dev \
    libpng-dev \
    vips-dev \
    libc6-compat \
    python3 \
    git

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --network-timeout 100000

# Copy application files
COPY . .

# Set environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

# Build the admin panel
RUN yarn build

# Create directories for uploads
RUN mkdir -p public/uploads .tmp

# Expose port
EXPOSE 1337

# Health check - Accept both 200 and 204 status codes
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "require('http').get('http://localhost:1337/_health', (r) => {process.exit((r.statusCode === 200 || r.statusCode === 204) ? 0 : 1)})"

# Start the application
CMD ["yarn", "start"]
