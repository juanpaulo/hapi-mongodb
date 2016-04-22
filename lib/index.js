'use strict';

const Hapi = require('hapi');
const Good = require('good');
const MongoPlug = require('mongo-plug');

const routes = ['services', 'pages', 'parameters'];
const services = require(`./paths/services`);
let database;

// Server connection
const server = new Hapi.Server();
server.connection({
  host: process.env.HAPI_HOST,
  port: process.env.HAPI_PORT
});

// Server routes
server.realm.modifiers.route.prefix = `/rest/api/${process.env.VERSION}`
server.route({
  method: ['POST', 'GET', 'PUT', 'DELETE'],
  path: '/services/{id?}',
  handler: (request, reply) => {
    services.handleRequest(request, reply, database)
  },
  config: {
    timeout: {
      server: process.env.HAPI_DEFAULT_TIMEOUT  // FIXME make server default?
    }
  }
});

server.register([{
  // MongoDB plugin
  register: MongoPlug,
  options: {
    url: `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`
  }
}, {
  // Logging plugin
  register: Good,
  options: {
    reporters: [{
      reporter: require('good-console'),
      events: {
        response: '*',
        log: '*'
      }
    }]
  }
}], (err) => {
  if (err) {
    throw err;
  }
  server.start((err) => {
    if (err) {
      throw err;
    }
    server.log('info', 'Hapi server started at: ' + server.info.uri);
    database = server.db;
  });
});
