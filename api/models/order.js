let mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    enum: ['FULFILL', 'UNFILLED', 'PENDING'],
    default: 'PENDING',
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };
