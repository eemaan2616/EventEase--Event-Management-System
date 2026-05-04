const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getBlogs);
router.get('/:id', getBlog);
router.post('/', protect, authorize('organizer', 'admin'), createBlog);
router.put('/:id', protect, authorize('organizer', 'admin'), updateBlog);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteBlog);

module.exports = router;
