# Use the specified Node version image as the base image
FROM node:20.13.1

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the project files to the container
COPY . .

# Build the React app for production
RUN npm run build

# Set the environment variable for the port
ENV PORT=3001

# Expose the port to the outside world
EXPOSE 3001

# Start the React app
CMD ["npm", "run", "start"]
