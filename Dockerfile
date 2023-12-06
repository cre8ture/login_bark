# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN npm install

ENV NODE_ENV=production

# Bundle app source inside the Docker image
COPY . .

# Make port available to the world outside this container
EXPOSE 3000

# Define the command to run the app
CMD ["node", "app.js"]
