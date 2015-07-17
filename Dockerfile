FROM node:0.8-onbuild

# Build app
RUN mkdir -p /usr/src/app  
WORKDIR /usr/src/app  
COPY . /usr/src/app

RUN npm install --production

EXPOSE 80

CMD ["node","./bin/www"] 