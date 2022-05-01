FROM node:16-alpine as builder
USER node
 
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package*.json .
RUN npm install --save axios react-router-dom
RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache
COPY --chown=node:node . .

RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /home/node/app/build /usr/share/nginx/html