FROM node:16-alpine

WORKDIR '/app'

COPY package.json .
RUN npm install


COPY . .


RUN ls


CMD ["npm", "run", "dev"]