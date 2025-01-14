# Use Node.js LTS base image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies)
ENV NODE_ENV=development
RUN npm install

# Copy the rest of the application
COPY . .

# Run tests
RUN npm test

# Expose the port your application runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]