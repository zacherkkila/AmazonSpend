FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install
RUN cd frontend && npm install

# Copy source code
COPY . .

# Create necessary directories if they don't exist
RUN mkdir -p frontend/public

# Build frontend
RUN cd frontend && npm run build

# Expose ports
EXPOSE 5000

# Start the application
CMD ["npm", "start"] 