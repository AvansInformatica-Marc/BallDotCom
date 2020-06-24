const Customer = require('../models/customer.model');
const MQService = require('../utils/MQService.utils');

const customerCreate = (req, res, next) => {
  const customerNew = new Customer({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phonenr: req.body.phonenr,
    adress: req.body.adress,
  });

  customerNew.save(async (err) => {
    if (err) return next(err);

    await MQService.sendMessage(
      'customer',
      JSON.stringify({ eventType: 'createCustomer', customer: customerNew })
    );
    await MQService.sendMessage(
      'notification',
      JSON.stringify({ eventType: 'createCustomer', customer: customerNew })
    );
    return res.status(200).json(customerNew).end();
  });
};

const customerUpdate = async (req, res, next) => {
  Customer.findByIdAndUpdate(req.params.id, { $set: req.body }, async (err) => {
    if (err) return next(err);

    await MQService.sendMessage(
      'customer',
      JSON.stringify({
        eventType: 'updateCustomer',
        customer: { _id: req.params.id, ...req.body },
      })
    );
    await MQService.sendMessage(
      'notification',
      JSON.stringify({
        eventType: 'updateCustomer',
        customer: { _id: req.params.id, ...req.body },
      })
    );
    return res
      .status(200)
      .json({ _id: req.params.id, ...req.body })
      .end();
  });
};

const customerDelete = (req, res, next) => {
  Customer.findByIdAndRemove(req.params.id, async (err, customer) => {
    if (err) return next(err);
    await MQService.sendMessage(
      'customer',
      JSON.stringify({ eventType: 'deleteCustomer', customer })
    );
    await MQService.sendMessage(
      'notification',
      JSON.stringify({ eventType: 'deleteCustomer', customer })
    );
    return res.status(200).json('Customer removed.').end();
  });
};

module.exports = {
  customerCreate,
  customerUpdate,
  customerDelete,
};
