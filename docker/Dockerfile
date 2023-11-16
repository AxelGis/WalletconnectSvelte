FROM node:18-alpine AS build
WORKDIR /app

RUN npm install -g npm

COPY package.json ./
COPY package-lock.json ./

RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.25.1
COPY --from=build /app/dist /opt/site
COPY docker/nginx.conf /etc/nginx/nginx.conf
