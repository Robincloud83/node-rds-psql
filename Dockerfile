# --- Stage 1: Build Stage ---
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app source code
COPY . .

# --- Stage 2: Runtime Stage ---
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app /app

# Expose app port
EXPOSE 3000

# Run the application
CMD ["node", "index.js"]
