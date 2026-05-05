const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.get('/organizer/me', protect, authorize('organizer', 'admin'), getMyEvents);
router.get('/', getEvents);
router.get('/:id', getEvent);
const eventValidators = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid event date is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('category').optional().isIn(['conference', 'workshop', 'seminar', 'concert', 'sports', 'other']).withMessage('Invalid category'),
];

router.post('/', protect, authorize('organizer', 'admin'), eventValidators, validate, createEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), eventValidators, validate, updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

module.exports = router;
