const mongoose = require('mongoose');

const { Schema } = mongoose;

const Notification = new Schema({
  datetime: { type: Date, required: true },
  eventType: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  to: { type: String, required: true },
  rawEvent: { type: Object, required: true },
});

module.exports = mongoose.model('notification', Notification);
