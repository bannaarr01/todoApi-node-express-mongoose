FROM node:14

WORKDIR /todoApi-node-express-mongoose

COPY package.json .

RUN npm install
#./ ./
COPY . .
#Default command

EXPOSE 3000

CMD ["npm", "start"]