FROM node:18-alpine

ENV NODE_ENV=production

RUN npm install -g @nestjs/cli

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "start:prod"]