FROM node:14.18-alpine3.14 AS builder

WORKDIR /app

COPY . .

# Install modules, build and remove unnecessary modules after
RUN mv .env.prod .env \
    && npm install \
    && npm run generate-types \
    && npm run build \
    && rm -rf src \
    && rm -f .npmrc

FROM nginx:mainline-alpine

COPY .nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html/

WORKDIR /usr/share/nginx/html

EXPOSE 1098 2098
