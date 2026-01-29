# frontend/Dockerfile

# 1️⃣ Base image
FROM node:20-alpine

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy dependency files first (for caching)
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy rest of app
COPY . .

# 6️⃣ Expose dev server port
EXPOSE 3000

# 7️⃣ Set env for CRA dev server
ENV CHOKIDAR_USEPOLLING=true
ENV HOST=0.0.0.0

# 8️⃣ Start CRA dev server
CMD ["npm", "start"]
