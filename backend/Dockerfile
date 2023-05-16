FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install 
RUN npm install ts-node

COPY . .

EXPOSE 3001

CMD ["npx", "ts-node", "--transpile-only", "index.ts"]
