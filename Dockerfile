FROM node:18-alpine

ENV NODE_ENV=production
ENV PORT=3000

RUN npm install -g @nestjs/cli

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "start:prod"]

EXPOSE 3000