# Stage 1: Build the application
FROM node:16.13 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run the application
FROM node:16.13

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm install --only=production
COPY .env .env

CMD ["node", "dist/main.js"]
