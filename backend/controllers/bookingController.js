const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const { generateTicketPDF } = require('../utils/pdfGenerator');

exports.createBooking = async (req, res) => {
  try {
    const { eventId, ticketTier, quantity = 1 } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const tier = event.tickets.find(t => t.tier === ticketTier);
    if (!tier) {
      return res.status(400).json({ message: 'Invalid ticket tier' });
    }

    if (tier.sold + quantity > tier.quantity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    const totalPrice = tier.price * quantity;

    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      ticketTier,
      quantity,
      totalPrice,
    });

    tier.sold += quantity;
    await event.save();

    await Notification.create({
      user: req.user._id,
      message: `Booking confirmed for "${event.title}" - ${ticketTier} ticket(s)`,
      type: 'booking',
      relatedEvent: event._id,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('event', 'title date location image')
      .populate('user', 'name email');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date location image category status organizer')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventBookings = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bookings = await Booking.find({ event: req.params.eventId })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.processPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.paymentStatus = 'paid';
    await booking.save();

    const event = await Event.findById(booking.event);
    await Notification.create({
      user: req.user._id,
      message: `Payment successful for "${event ? event.title : 'Event'}" - Ticket ID: ${booking.ticketId}`,
      type: 'booking',
      relatedEvent: booking.event,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('event', 'title date location image')
      .populate('user', 'name email');

    res.json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.downloadTicket = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event', 'title date location category')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Payment required before downloading ticket' });
    }

    const pdfBuffer = await generateTicketPDF(booking);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${booking.ticketId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
