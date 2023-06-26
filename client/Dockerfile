FROM node AS client_prod
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine AS prod
WORKDIR /usr/share/nginx/html
COPY --from=client_prod /app/build .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]