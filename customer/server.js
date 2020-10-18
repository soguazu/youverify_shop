const PROTO_PATH = './customers.proto';
const { Customer } = require('./model/customer');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const mongoose = require('mongoose');

mongoose.connect('mongodb://mongodb:27017/shop', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'CONNECTION ERROR'));
db.once('open', () => console.log('Database connected'));

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

var customersProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(customersProto.CustomerService.service, {
  get: (call, callback) => {
    const id = call.request.id;

    Customer.findById(id)
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
    console.log('Got here');
    let customer = new Customer({
      name: call.request.name,
      address: call.request.address,
      email: call.request.email,
      phone: call.request.phone,
      state: call.request.state,
      country: call.request.country,
    });

    customer
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

    Customer.findByIdAndUpdate(id, {
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
    Customer.findByIdAndDelete(id)
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

server.bind('0.0.0.0:30043', grpc.ServerCredentials.createInsecure());
console.log('Server running at http://0.0.0.0:30043');
server.start();
