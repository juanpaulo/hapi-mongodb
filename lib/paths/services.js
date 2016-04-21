/*jslint node: true */
'use strict';

const assert = require('assert');

let body = {};

exports.handleRequest = function(request, reply, db) {
  switch(request.method.toUpperCase()) {
    case 'POST':
      // TODO validation for request body
      db.collection('services').insertOne(request.payload, (err, result) =>
        // TODO application/json
        // TODO put location header
        reply(JSON.stringify(request.payload))
          .code(201)
          .type('application/json')
          // .header('X-Custom', 'some-value');
      );
      break;
    case 'GET':
      if(request.query.accountId || request.query.serviceId) {
        // TODO return malformed query if one is not present
        // console.log(encodeURIComponent(request.query.accountId));
        // console.log(encodeURIComponent(request.query.serviceId));
        // TODO get :id
      }
      else {
        var cursor = db.collection('services').find();
        body.services = [];
        cursor.each(function(err, doc) {
          assert.equal(err, null);
          if (doc !== null) {
            body.services.push(doc);
          } else {
            reply(body).code(200);
          }
        });
        // reply(body).type(200);
      }
      break;
    case 'PUT':
      // TODO
      break;
    case 'DELETE':
      // TODO
      break;
    default:
      // return error code 404?
  }
};
