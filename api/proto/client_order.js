const PROTO_PATH = `${__dirname}/orders.proto`;

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const OrderService = grpc.loadPackageDefinition(packageDefinition).OrderService;
const client = new OrderService(
  'order:30044',
  grpc.credentials.createInsecure(),
);

module.exports = client;
