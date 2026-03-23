# 프론트 빌드용 Dockerfile
FROM node:18 AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build