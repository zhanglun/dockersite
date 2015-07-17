FROM node

# Build app
RUN mkdir -p /usr/src/app  
WORKDIR /usr/src/app  
COPY . /usr/src/app

RUN  npm uninstall
RUN  npm cache clean
RUN  npm install --production

EXPOSE 80

CMD ["node","./bin/www"] 