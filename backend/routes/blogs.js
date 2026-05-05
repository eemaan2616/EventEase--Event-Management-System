const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const blogValidators = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
];

router.get('/', getBlogs);
router.get('/:id', getBlog);
router.post('/', protect, authorize('organizer', 'admin'), blogValidators, validate, createBlog);
router.put('/:id', protect, authorize('organizer', 'admin'), blogValidators, validate, updateBlog);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteBlog);

module.exports = router;
