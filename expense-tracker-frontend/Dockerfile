# frontend/Dockerfile

# 1️⃣ Base image
FROM node:20-alpine AS build

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy dependency files first (for caching)
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy rest of app
COPY . .

RUN npm run build

#Serve with Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
