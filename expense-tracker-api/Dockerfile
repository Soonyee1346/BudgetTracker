# 1️⃣ Base image
FROM node:20-alpine

# 2️⃣ Set working directory inside container
WORKDIR /app

# 3️⃣ Copy dependency files first (for caching)
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy the rest of the app
COPY . .

COPY ./certs /app/certs

# 6️⃣ Generate Prisma client
RUN npx prisma generate

# 7️⃣ Expose backend port
EXPOSE 3001

# 8️⃣ Start the app
CMD ["npm", "run", "dev"]

