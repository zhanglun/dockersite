FROM node

# Build app
RUN mkdir -p /usr/src/app  
WORKDIR /usr/src/app  
COPY . /usr/src/app

RUN sudo npm uninstall
RUN sudo npm cache clean
RUN sudo npm install --production

EXPOSE 80

CMD ["node","./bin/www"] 