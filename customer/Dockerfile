FROM node:alpine

EXPOSE 30043

WORKDIR /app

COPY package.json  .

RUN npm install

COPY . .

CMD ["npm", "start"]