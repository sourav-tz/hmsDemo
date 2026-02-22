FROM node:18-alpine

WORKDIR /app

ENV NODE_OPTIONS=--max-old-space-size=4096

# Copy dependency files first
COPY package.json package-lock.json* ./

RUN npm install --legacy-peer-deps

# Copy rest of the app
COPY . .

CMD ["npm","run","dev"]
