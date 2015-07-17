FROM node

# Build app
RUN mkdir -p /usr/src/app  
WORKDIR /usr/src/app  
COPY . /usr/src/app

RUN npm install --production
RUN npm uninstall

EXPOSE 80

CMD ["node","./bin/www"] 