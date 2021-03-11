FROM node:lts-alpine

COPY . .

RUN npm install

EXPOSE 8080
CMD [ "node", "src/index.js" ]