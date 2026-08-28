# Use the Node.js 20 Alpine image as the base
FROM node:22-alpine AS base

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy the entire application code to the container
COPY . .

# Expose the application port
EXPOSE 3000

# Use nodemon for development
CMD ["npm", "run", "dev"]