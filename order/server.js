const PROTO_PATH = './orders.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const amqp = require('amqplib/callback_api');

// global.Mongoose = require('mongoose');
// Mongoose.connect('mongodb://localhost/grpc');
const mongoose = require('mongoose');

mongoose.connect('mongodb://mongodb:27017/shop', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'CONNECTION ERROR'));
db.once('open', () => console.log('Database connected'));

const { Order } = require('./model/order');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const ordersProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(ordersProto.OrderService.service, {
  insert: (call, callback) => {
    let order = new Order({
      productId: call.request.productId,
      customerId: call.request.customerId,
    });

    order
      .save()
      .then((data) => {
        amqp.connect('amqp://rabbitmq', (connError, connection) => {
          if (connError) {
            callback(connError, {});
          }
          connection.createChannel((ChannelError, channel) => {
            if (ChannelError) {
              callback(channelError, {});
            }
            const QUEUE = 'order';
            channel.assertQueue(QUEUE);
            channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(data)));
            console.log('Message sent');
            callback(null, data);
          });
        });
      })
      .catch((error) => {
        callback(error, {});
      });
  },
});

server.bind('0.0.0.0:30044', grpc.ServerCredentials.createInsecure());
console.log('Server running at http://0.0.0.0:30044');
server.start();
