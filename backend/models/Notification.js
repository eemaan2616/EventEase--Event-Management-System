const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['booking', 'reminder', 'system'],
    default: 'system',
  },
  read: {
    type: Boolean,
    default: false,
  },
  relatedEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
