var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development';

if (process.env.MONGODB_PORT_27017_TCP_PORT) {
  env = "production";
}

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'docker-node'
    },
    port: 1234,
    mongodb: {
      host: 'mongodb://localhost/sitedev'
    },
    redis: {
      host: '127.0.0.1',
      post: '6379'
    },
    qiniu: {
      ACCESS_KEY: 'bLoheoE20UeRGdBhXkXwl3loi0GgQjDeny1LHW57',
      SERECT_KEY: 'yD06aKKy3GdFvuka0YA89Usfrw9TRq6cHgcc_M53',
      host: 'http://7xnrrd.com1.z0.glb.clouddn.com/',
      bucket: 'blog'
    },
    secert: 'zhanglun1410@gmail.com'
  },

  test: {
    root: rootPath,
    app: {
      name: 'docker-node'
    }
    ,
    port: 3000,
    db: 'mongodb://localhost/docker-node-test',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      password: ''
    }
  }
  ,

  production: {
    root: rootPath,
    app: {
      name: 'docker-node'
    }
    ,
    port: 3000,
    db: 'mongodb://localhost/docker-node-production',
    mongodb: {
      port: process.env.MONGODB_PORT_27017_TCP_PORT,
      addr: process.env.MONGODB_PORT_27017_TCP_ADDR,
      instance: process.env.MONGODB_INSTANCE_NAME,
      password: process.env.MONGODB_PASSWORD,
      username: process.env.MONGODB_USERNAME
    }
    ,
    redis: {
      host: process.env.REDIS_PORT_6379_TCP_ADDR,
      port: process.env.REDIS_PORT_6379_TCP_PORT,
      password: process.env.REDIS_PASSWORD
    },
    qiniu: {
      ACCESS_KEY: 'bLoheoE20UeRGdBhXkXwl3loi0GgQjDeny1LHW57',
      SERECT_KEY: 'yD06aKKy3GdFvuka0YA89Usfrw9TRq6cHgcc_M53',
      host: 'http://7xnrrd.com1.z0.glb.clouddn.com/',
      bucket: 'blog'
    },
    secert: 'zhanglun1410@gmail.com'
  }

};

module.exports = config[env];
