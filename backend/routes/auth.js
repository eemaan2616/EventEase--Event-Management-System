const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/authRateLimit');

const passwordRules = body('password')
  .isLength({ min: 8, max: 128 })
  .withMessage('Password must be 8–128 characters')
  .matches(/[a-zA-Z]/)
  .withMessage('Password must contain at least one letter')
  .matches(/\d/)
  .withMessage('Password must contain at least one number');

router.post('/register', authLimiter, [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  passwordRules,
], validate, register);

router.post('/login', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').trim().notEmpty().withMessage('Password is required').isLength({ max: 128 }).withMessage('Password is too long'),
], validate, login);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
