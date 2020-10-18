process.env.NODE_ENV = 'test';

global.Mongoose = require('mongoose');
const config = require('../config');

Mongoose.connect(`mongodb://localhost/${config.db}`);

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let { Customer } = require('../models/customer');

let should = chai.should();

chai.use(chaiHttp);

describe('Customers', () => {
  beforeEach((done) => {
    Customer.remove({}, (err) => {
      done();
    });
  });

  describe.skip('/POST Customer', () => {
    it('it should not POST a Customer without all fields', (done) => {
      let customer = {
        name: 'John Doe',
        address: 'J.R.R. Tolkien',
        email: 'john.doe@test.com',
        country: 'Nigeria',
        phone: '08034582349',
      };
      chai
        .request(server)
        .post('/api/v1/customer/')
        .send(customer)
        .end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('success').eql(false);
          res.body.should.be.a('object');
          done();
        });
    });
    it('it should POST a Customer only without email', (done) => {
      let customer = {
        name: 'John Doe',
        address: 'J.R.R. Tolkien',
        country: 'Nigeria',
        phone: '08034582349',
        state: 'Nigeria',
      };
      chai
        .request(server)
        .post('/api/v1/customer/')
        .send(customer)
        .end((err, res) => {
          res.body.should.have.property('status').eql(201);
          res.body.should.have.property('success').eql(true);
          res.body.should.be.a('object');
          done();
        });
    });
    it('it should POST a Customer', (done) => {
      let customer = {
        name: 'John Doe',
        address: 'J.R.R. Tolkien',
        country: 'Nigeria',
        email: 'john.doe@test.com',
        phone: '08034582349',
        state: 'Nigeria',
      };
      chai
        .request(server)
        .post('/api/v1/customer/')
        .send(customer)
        .end((err, res) => {
          res.body.should.have.property('status').eql(201);
          res.body.should.have.property('success').eql(true);
          res.body.should.be.a('object');
          done();
        });
    });
  });
  /*
   * Test the /GET/:id route
   */
  describe.skip('/GET/:id Customer', () => {
    it('it should GET a Customer by the given id', (done) => {
      let customer = new Customer({
        name: 'The Lord of the Rings',
        address: 'J.R.R. Tolkien',
        state: 'Lagos',
        country: 'Nigeria',
        email: 'lord.ring@test@gmail.com',
      });
      customer.save((err, customer) => {
        chai
          .request(server)
          .get('/api/v1/customer/' + customer._id)
          .send(customer)
          .end((err, res) => {
            console.log(res, 'res');
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(201);
            res.body.should.have.property('success').eql(true);
            res.body.data.should.have.property('_id').eql(customer.id);
            done();
          });
      });
    });
  });
});
