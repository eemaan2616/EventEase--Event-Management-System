const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { submitContact, getContacts } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
], validate, submitContact);

router.get('/', protect, authorize('admin'), getContacts);

module.exports = router;
