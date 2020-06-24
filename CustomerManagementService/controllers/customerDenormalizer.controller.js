/* eslint-disable no-underscore-dangle */
const CustomerRead = require('../models/customerRead.model');

const customerCreate = (customer) => {
  const customerNew = new CustomerRead(customer);

  customerNew.save((err) => {
    if (err) console.error(err);
  });
};

const customerUpdate = (customer) => {
  CustomerRead.findByIdAndUpdate(customer._id, { $set: customer }, (err) => {
    if (err) console.error(err);
  });
};

const customerDelete = (customer) => {
  CustomerRead.findByIdAndRemove(customer._id, (err) => {
    if (err) console.error(err);
  });
};

module.exports = {
  customerCreate,
  customerUpdate,
  customerDelete,
};
