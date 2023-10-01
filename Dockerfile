FROM node:20.7.0
WORKDIR /foundo-app

COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]