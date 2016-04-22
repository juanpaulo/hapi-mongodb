'use strict';

const Boom = require('boom');
const ObjectId = require('mongodb').ObjectId;
// const assert = require('assert');

let body = {};

exports.handleRequest = (request, reply, db) => {
  const col = db.collection('services');
  // TODO add ObjectId validation

  switch(request.method.toUpperCase()) {
    case 'POST':
      if (request.params.id) {
        // 404 (Not Found), 409 (Conflict) if resource already exists..
        reply(Boom.notFound());
      } else {
        // 201 (Created), 'Location' header with link to /customers/{id} containing new ID.
        // TODO validation for request payload
        col.insertOne(request.payload, (err, doc) => {
          reply()
            .code(201)
            .header('Location', `${request.path}${doc.insertedId}`);
        });
      }
      break;
    case 'GET':
      if (request.params.id) {
        // 200 (OK), single customer. 404 (Not Found), if ID not found or invalid.
        db.collection('services').findOne({ _id: ObjectId(request.params.id) }, (err, doc) => {
          if (doc) {
            reply(doc);
          } else {
            reply(Boom.notFound());
          }
        });
      } else {
        // 200 (OK), list of customers. Use pagination, sorting and filtering to navigate big lists.
        // TODO pagination, sorting and filtering
        db.collection('services').find().toArray((err, docs) => {
          reply(docs);
        });
      }
      break;
    case 'PUT':
      if (request.params.id) {
        // 200 (OK) or 204 (No Content). 404 (Not Found), if ID not found or invalid.
        db.collection('services').updateOne({ _id: ObjectId(request.params.id) }, { $set: request.payload }, (err, doc) => {
          if (doc) {
            reply();
          } else {
            reply(Boom.notFound());
          }
        });
      } else {
        // 404 (Not Found), unless you want to update/replace every resource in the entire collection.
        reply(Boom.notFound());
      }
      break;
    case 'DELETE':
      if (request.params.id) {
        // 200 (OK). 404 (Not Found), if ID not found or invalid.
        db.collection('services').deleteOne({ _id: ObjectId(request.params.id) }, { $set: request.payload }, (err, doc) => {
          if (doc) {
            reply();
          } else {
            reply(Boom.notFound());
          }
        });
      } else {
        // 404 (Not Found), unless you want to delete the whole collection—not often desirable.
        reply(Boom.notFound());
      }
      break;
  }
};
