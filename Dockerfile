# Use Node.js LTS (18) as the base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for efficient caching
COPY package*.json ./

# Install dependencies (only production dependencies)
RUN npm install --production
RUN npm install aws-sdk

# Copy application code
COPY . .

# Expose the application port (change if needed, e.g., 8080)
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
