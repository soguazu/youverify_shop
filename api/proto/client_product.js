const PROTO_PATH = `${__dirname}/products.proto`;

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const ProductService = grpc.loadPackageDefinition(packageDefinition)
  .ProductService;
const client = new ProductService(
  'product:30045',
  grpc.credentials.createInsecure(),
);

module.exports = client;
