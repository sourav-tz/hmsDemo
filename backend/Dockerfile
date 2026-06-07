# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=21.6.2

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=test

WORKDIR /usr/src/app

COPY package.json .

RUN npm i

# Copy rest of source first
COPY . .

# Fix ownership AFTER copy
RUN mkdir -p /usr/src/app/public/uploads \
 && chown -R node:node /usr/src/app/public

# Run as non-root
USER node

EXPOSE 3000

CMD ["npm", "run", "dev"]
