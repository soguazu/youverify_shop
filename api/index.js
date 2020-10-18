require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const client_customer = require('./proto/client_customer');
const client_order = require('./proto/client_order');
const client_product = require('./proto/client_product');
const {
  createCustomerSchema,
  updateCustomerSchema,
  createProductSchema,
  updateProductSchema,
  orderSchema,
} = require('./validators');

const swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/v1/customer/:id', (req, res) => {
  let id = req.params['id'];
  console.log(req.params);
  client_customer.get({ id }, (err, data) => {
    if (!err) {
      res.send({
        success: true,
        data,
        status: 200,
      });
    } else {
      res.send({
        success: false,
        message: err,
        status: 400,
      });
    }
  });
});

app.post('/api/v1/customer/', (req, res) => {
  let newCustomer = {
    ...req.body,
  };

  const { error } = createCustomerSchema.validate(newCustomer);
  if (error) {
    return res.send({
      success: false,
      message: error,
      status: 400,
    });
  }

  client_customer.insert(newCustomer, (err, data) => {
    if (err) {
      return res.send({
        success: false,
        message: err,
        status: 400,
      });
    }

    res.send({ success: true, data, status: 201 });
  });
});

app.patch('/api/v1/customer/:id', (req, res) => {
  const { error } = updateCustomerSchema.validate(req.body);
  if (error) {
    return res.send({
      success: false,
      message: error,
      status: 400,
    });
  }

  const updateCustomer = {
    _id: req.params['id'],
    ...req.body,
  };

  client_customer.update(updateCustomer, (err, data) => {
    if (err) {
      return res.send({
        success: false,
        message: err,
        status: 400,
      });
    }

    res.send({
      success: true,
      message: 'Customer updated successfully',
      status: 200,
    });
  });
});

app.delete('/api/v1/customer/:id', (req, res) => {
  client_customer.remove({ id: req.params['id'] }, (err, _) => {
    if (err) {
      return res.send({
        success: false,
        message: err,
        status: 400,
      });
    }

    res.send({
      success: true,
      message: 'Customer removed successfully',
      status: 200,
    });
  });
});

app.post('/api/v1/order/', (req, res) => {
  let newOrder = {
    ...req.body,
  };

  const { error } = orderSchema.validate(newOrder);
  if (error) {
    return res.send({
      success: false,
      message: error,
      status: 400,
    });
  }

  client_order.insert(newOrder, (err, data) => {
    if (err) {
      return res.send({
        success: false,
        message: err,
        status: 400,
      });
    }

    res.send({ success: true, data, status: 200 });
  });
});

app.get('/api/v1/product/:id', (req, res) => {
  let id = req.params['id'];
  client_product.get({ id }, (err, data) => {
    if (!err) {
      return res.send({ success: true, data, status: 200 });
    }

    res.send({
      success: false,
      message: err,
      status: 400,
    });
  });
});

app.post('/api/v1/product/', (req, res) => {
  let newProduct = {
    ...req.body,
  };

  const { error } = createProductSchema.validate(newProduct);
  if (error) {
    return res.send({
      success: false,
      message: error,
      status: 400,
    });
  }
  client_product.insert(newProduct, (err, data) => {
    if (err) {
      return res.send({
        success: false,
        message: err,
        status: 400,
      });
    }

    res.send({ success: true, data, status: 201 });
  });
});

app.patch('/api/v1/product/:id', (req, res) => {
  const { error } = updateProductSchema.validate(req.body);
  if (error) {
    return res.send({
      success: false,
      message: error,
      status: 400,
    });
  }

  const updateProduct = {
    _id: req.params['id'],
    ...req.body,
  };

  client_product.update(updateProduct, (err, data) => {
    if (err) {
      return res.send({
        success: false,
        message: err,
        status: 400,
      });
    }

    res.send({
      success: true,
      message: 'Product updated successfully',
      status: 200,
    });
  });
});

app.delete('/api/v1/product/:id', (req, res) => {
  client_product.remove({ id: req.params['id'] }, (err, _) => {
    if (err) {
      return res.send({
        success: false,
        message: err,
        status: 400,
      });
    }

    res.send({
      success: true,
      message: 'Product removed successfully',
      status: 200,
    });
  });
});

app.use('/api/v1/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Server running at port %d', PORT);
});

module.exports = app;
