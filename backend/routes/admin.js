const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser, getAllEvents } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/events', getAllEvents);

module.exports = router;
