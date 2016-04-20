/*jslint node: true */
'use strict';

const services = require('./src/paths/services');

const Hapi = require('hapi');
const Good = require('good');

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

server.route({
  method: ['POST', 'GET', 'PUT', 'DELETE'],
  path: '/pages/{id?}',
  handler: (request, reply) =>
    services.handleRequest(request, reply, database)
});

server.route({
  method: ['POST', 'GET', 'PUT', 'DELETE'],
  path: '/tags/{id?}',
  handler: (request, reply) =>
    services.handleRequest(request, reply, database)
});

// MongoDB constants
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`;

server.register({
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
}, (err) => {
  if (err) {
    throw err;
  }
  server.start((err) => {
    if (err) {
      throw err;
    }
    server.log('info', 'Hapi server started at: ' + server.info.uri);

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log(`MongoDB client connected to ${url}`);

      database = db;
    });
  });
});
