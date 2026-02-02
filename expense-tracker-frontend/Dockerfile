# Stage 1: Build the React Application
FROM node:20-alpine AS build

# 1. Receive the build argument from GitHub Actions
ARG REACT_APP_API_URL
# 2. Bake it into the app during the build process
ENV REACT_APP_API_URL=$REACT_APP_API_URL

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 3. Create the production build (Outputs to /app/build)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# 4. Copy the custom Nginx config you already have
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 5. Copy the built React files from the previous stage
# Note: Create React App uses 'build', not 'dist'
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]