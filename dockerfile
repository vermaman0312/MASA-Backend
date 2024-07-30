FROM node:20.11.1-alpine

WORKDIR /app

COPY . .

RUN npm install 

CMD ["npm", "run", "dev"]