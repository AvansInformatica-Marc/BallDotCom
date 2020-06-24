const nodemailer = require('nodemailer');
const sprintf = require('sprintf');

const { templates, subjects } = require('./statics/contants');
const Notification = require('./models/notification.model');

const sendNotification = async (notification, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: notification.to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.error(error);
    return console.info(info.response);
  });
};

const notificationReceived = (event) => {
  // Create notification from Event
  const notification = new Notification({
    datetime: Date.now(),
    eventType: event.eventType,
    to: event.customer.email,
    firstname: event.customer.firstname,
    lastname: event.customer.lastname,
    rawEvent: event,
  });

  // Save notification to Mongo
  notification.save(async (err) => {
    if (err) console.error(err);

    // Get template by event
    const template = event.eventType.toUpperCase();

    sendNotification(
      notification,
      subjects[template],
      sprintf(templates[template], notification.firstname)
    );
  });
};

module.exports = {
  notificationReceived,
};
