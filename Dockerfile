# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY client/package*.json ./client/

# Install server dependencies
RUN npm install

# Install client dependencies
RUN cd client && npm install

# Copy client source files (including public directory)
COPY client/src ./client/src
COPY client/public ./client/public

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Build the client
RUN cd client && npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"] 