# Stage 1: Build the application
FROM node:20.13.1 AS builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm v10.8.2 if not already the default
RUN npm install -g npm@10.8.2

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:20.13.1

WORKDIR /usr/src/app

# Copy the built files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm v10.8.2 if not already the default
RUN npm install -g npm@10.8.2

# Install production dependencies
RUN npm install --only=production

# Copy the .env file
COPY .env .env

# Command to run the application
CMD ["node", "dist/main.js"]
