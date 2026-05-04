const mongoose = require('mongoose');

const ticketTierSchema = new mongoose.Schema({
  tier: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  sold: {
    type: Number,
    default: 0,
  },
}, { _id: true });

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date'],
  },
  endDate: {
    type: Date,
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  category: {
    type: String,
    enum: ['conference', 'workshop', 'seminar', 'concert', 'sports', 'other'],
    default: 'other',
  },
  image: {
    type: String,
    default: '',
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tickets: [ticketTierSchema],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },
}, { timestamps: true });

eventSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Event', eventSchema);
