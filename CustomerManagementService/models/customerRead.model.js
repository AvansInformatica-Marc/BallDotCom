const mongoose = require('mongoose');

const { Schema } = mongoose;

const customerReadSchema = new Schema({
  firstname: { type: String, required: true, max: 150 },
  lastname: { type: String, required: true, max: 150 },
  email: { type: String, required: true },
  phonenr: { type: String, required: true },
  adress: { type: String, required: true },
});

// Export the model
module.exports = mongoose.model('customerRead', customerReadSchema);
