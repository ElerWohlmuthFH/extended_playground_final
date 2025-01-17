FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force
RUN npm install

COPY . .

RUN npm run build

EXPOSE 80

CMD ["npm", "start"]
