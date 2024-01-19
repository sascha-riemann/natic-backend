# Base image
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

ENV PORT 8080
ENV HOST 0.0.0.0

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build

RUN npm run build

# Cloud Sql Proxy
RUN apk update && apk add wget
RUN wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
RUN chmod +x cloud_sql_proxy

CMD ["sh", "-c", "./cloud_sql_proxy -instances=natic-391722:europe-west3:natic-database=tcp:0.0.0.0:5432 & node dist/main.js"]
