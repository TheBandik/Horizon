FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./

# Супер-надёжно: сброс lock внутри контейнера (обходит баг npm/lock с optional deps)
RUN rm -f package-lock.json \
  && npm cache clean --force \
  && npm install

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# На всякий: принудительно ставим rollup native для linux x64 gnu
RUN npm install -D @rollup/rollup-linux-x64-gnu

RUN npm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

