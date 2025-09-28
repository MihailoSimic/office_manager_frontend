# =====================
# Stage 1: Build React app
# =====================
FROM node:20-alpine AS build

# Set workdir
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the app
RUN npm run build

# =====================
# Stage 2: Serve with nginx
# =====================
FROM nginx:stable-alpine

# Copy build output to nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config if postoji (opciono)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
