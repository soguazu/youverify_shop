const express = require('express');

const amqp = require('amqplib/callback_api');
const app = express();
const { Order } = require('./model/order');
// global.Mongoose = require('mongoose');
// Mongoose.connect('mongodb://localhost/grpc');

const mongoose = require('mongoose');

mongoose.connect('mongodb://mongodb:27017/shop', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'CONNECTION ERROR'));
db.once('open', () => console.log('Database connected'));

amqp.connect('amqp://rabbitmq', (connError, connection) => {
  if (connError) {
    console.log(connError);
  }
  connection.createChannel((ChannelError, channel) => {
    if (ChannelError) {
      console.log(channelError);
    }
    const QUEUE = 'order';
    channel.assertQueue(QUEUE);
    channel.consume(
      QUEUE,
      (msg) => {
        const PAYMENT_SUCCESS = true;

        const payload = JSON.parse(msg.content.toString());

        let { _id: id } = payload;

        if (PAYMENT_SUCCESS) {
          Order.findByIdAndUpdate(id, {
            $set: {
              status: 'FULFILL',
            },
          })
            .then((resp) => {
              console.log('Order updated order successfully');
            })
            .catch((error) => {
              console.log(`Error: ${error}`);
            });
        } else {
          Order.findByIdAndUpdate(id, {
            $set: {
              status: 'UNFULFILLED',
            },
          })
            .then((resp) => {
              console.log('Oder updated order successfully');
            })
            .catch((error) => {
              console.log(`Error: ${error}`);
            });
        }
      },
      { noAck: true },
    );
  });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log('Server running at port %d', PORT);
});
