FROM node:14-alpine AS development
ENV NODE_ENV development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install typescript
RUN npm install -g serve
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["serve", "-s", "build"]