# Base image
FROM node:20-slim

# Set working directory inside container
WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the app
COPY . .

RUN npx prisma generate

# Expose backend port
EXPOSE 3001

# Start the app
CMD ["node", "src/app.js"]

