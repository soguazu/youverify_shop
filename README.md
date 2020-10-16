# Youverify shop. Implementation of microservices with Node, MongoDB, gRPC and rabbitmq

This project is separated in five parts:

- Api: Api service serves as an agregator service and the API documentation is directlty tired to this service using REST API.
- Customer: Api directly communicates to this service, making request via remote calls defined in the proto file.
- Product: Api directly communicates to this service, making request via remote calls defined in the proto file.
- Order: Gets order request via remote calls from the Api service, register the order and make an asynchronous call to rabbitmq to add that order to the queue.
- Payment: Consumes the order queue and tries making payment, if successful, order status is updated fulfill, else unfulfill.

In order to run this app, issue the command below:

- Inside the / (root) folder: `docker-compose up --build`

Then, go to http://localhost:8080/api/v1/doc and test it out.
