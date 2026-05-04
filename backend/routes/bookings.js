const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getEventBookings,
  processPayment,
  downloadTicket,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/me', protect, getMyBookings);
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), getEventBookings);
router.put('/:id/pay', protect, processPayment);
router.get('/:id/ticket', protect, downloadTicket);

module.exports = router;
