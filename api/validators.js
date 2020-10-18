let Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const createCustomerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  phone: Joi.string().min(11).max(20).required(),
  address: Joi.string().max(1000).required(),
  state: Joi.string().max(100).required(),
  country: Joi.string().max(100).required(),
  email: Joi.string().email(),
});

const updateCustomerSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  phone: Joi.string().min(11).max(20),
  address: Joi.string().max(1000),
  state: Joi.string().max(100),
  country: Joi.string().max(100),
  email: Joi.string().email(),
});

const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(500).required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(200),
  description: Joi.string().max(500),
});

const orderSchema = Joi.object({
  customerId: Joi.objectId(),
  productId: Joi.objectId(),
});

module.exports = {
  createCustomerSchema,
  updateCustomerSchema,
  createProductSchema,
  updateProductSchema,
  orderSchema,
};
