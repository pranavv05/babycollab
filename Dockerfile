# Use Node.js 18 alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy all files
COPY . .

# Expose port
EXPOSE 3000

# Build the Next.js app
RUN npm run build

# Start the application
CMD ["npm", "start"]