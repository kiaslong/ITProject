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

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:20.13.1

WORKDIR /usr/src/app

# Copy the built files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm v10.8.2 if not already the default
RUN npm install -g npm@10.8.2

# Install production dependencies
RUN npm install --only=production --quiet

# Copy the .env file
COPY .env .env

# Copy Prisma schema and migrations
COPY prisma ./prisma

# Generate Prisma client again in the final stage
RUN npx prisma generate

# Command to run the application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]