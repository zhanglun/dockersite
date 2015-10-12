var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development';
if (process.env.MONGODB_PORT_27017_TCP_PORT) {
  env = "production";
}
console.log('----app config----: env ' + env );
var config = {
  development: {
    root: rootPath,
    app: {
      name: 'docker-node'
    },
    port: 3000,
    db: 'mongodb://localhost/docker-node-development',
    redis: {
      host: '127.0.0.1',
      post: '6379'
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'docker-node'
    },
    port: 3000,
    db: 'mongodb://localhost/docker-node-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'docker-node'
    },
    port: 3000,
    db: 'mongodb://localhost/docker-node-production',
    redis: {
      host: '127.0.0.1',
      post: '6379'
    }
  },

  mongodb: {
    port: process.env.MONGODB_PORT_27017_TCP_PORT,
    addr: process.env.MONGODB_PORT_27017_TCP_ADDR,
    instance: process.env.MONGODB_INSTANCE_NAME,
    password: process.env.MONGODB_PASSWORD,
    username: process.env.MONGODB_USERNAME
  }
};

module.exports = config[env];
