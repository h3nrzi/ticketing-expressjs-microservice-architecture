FROM node:alpine

WORKDIR /app
COPY package-lock.json package.json ./
RUN npm install --omit=dev
COPY ./ ./

CMD ["npm", "start"]
