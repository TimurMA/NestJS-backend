FROM node:18.16.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ .

EXPOSE 3000

CMD ["sh", "-c", "npm run migrate && npm run start:prod"]
