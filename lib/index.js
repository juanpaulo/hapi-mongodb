'use strict';

// TODO programmatically include all paths
const services = require('./paths/services');

const Hapi = require('hapi');
const Good = require('good');
const MongoPlug = require('mongo-plug');

let database;

// Server connection
const server = new Hapi.Server();
server.connection({
  host: process.env.HAPI_HOST,
  port: process.env.HAPI_PORT
});

// Server routes
server.route({
  method: ['POST', 'GET', 'PUT', 'DELETE'],
  path: '/services/{id?}',
  handler: (request, reply) =>
    services.handleRequest(request, reply, database)
});

server.register([{
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
}, {
  register: MongoPlug,
  options: {
    url: `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`
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
