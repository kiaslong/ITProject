# Stage 1: Build the application
FROM node:20.13.1 

WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

RUN npm run build

EXPOSE 3000



CMD [  "npm", "run", "start:migrate:prod" ]