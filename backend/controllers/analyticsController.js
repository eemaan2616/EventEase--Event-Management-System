const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

exports.getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const paidBookings = await Booking.find({ paymentStatus: 'paid' });
    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const eventsByCategory = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('event', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalUsers,
      totalEvents,
      totalBookings,
      totalRevenue,
      usersByRole,
      eventsByCategory,
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrganizerAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id });
    const eventIds = events.map(e => e._id);

    const totalEvents = events.length;
    const totalBookings = await Booking.countDocuments({ event: { $in: eventIds } });
    const paidBookings = await Booking.find({ event: { $in: eventIds }, paymentStatus: 'paid' });
    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    const bookingsPerEvent = await Booking.aggregate([
      { $match: { event: { $in: eventIds } } },
      { $group: { _id: '$event', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
    ]);

    const eventsWithBookings = events.map(event => {
      const stats = bookingsPerEvent.find(b => b._id.toString() === event._id.toString());
      return {
        _id: event._id,
        title: event.title,
        date: event.date,
        status: event.status,
        bookings: stats ? stats.count : 0,
        revenue: stats ? stats.revenue : 0,
      };
    });

    res.json({
      totalEvents,
      totalBookings,
      totalRevenue,
      eventsWithBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
