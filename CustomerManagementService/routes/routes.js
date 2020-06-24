const router = require('express').Router();
const customerCommandController = require('../controllers/customerCommand.controller');
const customerQueryController = require('../controllers/customerQuery.controller');

// command
router.post('/', customerCommandController.customerCreate);
router.put('/:id', customerCommandController.customerUpdate);
router.delete('/:id', customerCommandController.customerDelete);

// query
router.get('/:id', customerQueryController.customerRead);
router.get('/', customerQueryController.customerGetAll);

router.use('*', (req, res) =>
  res.status(404).json({ message: 'Endpoint Not found' }).end()
);

module.exports = router;
