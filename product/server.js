const PROTO_PATH = './products.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

// global.Mongoose = require('mongoose');
// Mongoose.connect('mongodb://localhost/grpc');
const mongoose = require('mongoose');

mongoose.connect('mongodb://mongodb:27017/shop', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'CONNECTION ERROR'));
db.once('open', () => console.log('Database connected'));

const { Product } = require('./model/product');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const productsProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(productsProto.ProductService.service, {
  get: (call, callback) => {
    const id = call.request.id;
    Product.findById(id)
      .then((data) => {
        callback(null, data);
      })
      .catch((error) => {
        callback({
          code: grpc.status.NOT_FOUND,
          details: error,
        });
      });
  },

  insert: (call, callback) => {
    let product = new Product({
      name: call.request.name,
      description: call.request.description,
    });

    product
      .save()
      .then((data) => {
        callback(null, data);
      })
      .catch((error) => {
        callback(error, {});
      });
  },

  update: (call, callback) => {
    const id = call.request._id;

    const data = call.request;
    delete data['id'];

    Product.findByIdAndUpdate(id, {
      $set: {
        ...data,
      },
    })
      .then((resp) => {
        callback(null, resp);
      })
      .catch((error) => {
        callback({
          code: grpc.status.NOT_FOUND,
          details: error,
        });
      });
  },

  remove: (call, callback) => {
    let { id } = call.request;
    Product.findByIdAndDelete(id)
      .then((data) => {
        callback(null, data);
      })
      .catch((error) => {
        callback({
          code: grpc.status.NOT_FOUND,
          details: error,
        });
      });
  },
});

server.bind('0.0.0.0:30045', grpc.ServerCredentials.createInsecure());
console.log('Server running at http://0.0.0.0:30045');
server.start();
