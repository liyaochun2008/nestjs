FROM node:16

WORKDIR /src

RUN npm i -g @nestjs/cli

COPY package.json .

RUN npm i

COPY . .

EXPOSE 3000

CMD ["nest", "start"]
