let mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    max: 255,
  },
  state: {
    type: String,
    required: true,
    max: 100,
  },
  country: {
    type: String,
    required: true,
    max: 100,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = { Customer };
