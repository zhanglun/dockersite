FROM node:6.3.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install

EXPOSE 80

CMD ["node","server.js"]
