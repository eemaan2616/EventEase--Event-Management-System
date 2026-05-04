const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
