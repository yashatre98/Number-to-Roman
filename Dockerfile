# Use Node.js LTS base image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./


# Copy the rest of the application
COPY . .

# Install all dependencies (including devDependencies)
ENV NODE_ENV=development
RUN npm install
RUN npm install supertest express-prom-bundle --save-dev

# Run tests
RUN npm test

# Expose the port your application runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]