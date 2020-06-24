const CustomerRead = require('../models/customerRead.model');

const customerRead = (req, res, next) => {
  CustomerRead.findById(req.params.id, (err, customer) => {
    if (err) return next(err);
    return res.status(200).json(customer).end();
  });
};

const customerGetAll = (req, res, next) => {
  CustomerRead.find((err, customers) => {
    if (err) return next(err);
    return res.status(200).json(customers).end();
  });
};

module.exports = {
  customerRead,
  customerGetAll,
};
