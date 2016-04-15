/*jslint node: true */
const assert = require('assert');

exports.handleRequest = function(request, reply, db) {
  // console.log(request);
  switch(request.method.toUpperCase()) {
    case 'POST':
      // TODO
      break;
    case 'GET':
      if(request.params.id) {
        console.log(encodeURIComponent(request.params.id));
        // TODO get :id
      }
      else {
        console.log('list');
        // TODO get all
      }
      break;
    case 'PUT':
      // TODO
      break;
    case 'DELETE':
      // TODO
      break;
    default:
      // return error code
  }
  reply('TODO');
};
