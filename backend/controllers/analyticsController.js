const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

const buildSeriesFromDocs = (docs, field = 'count') => {
  const dateMap = new Map();
  docs.forEach((doc) => {
    const date = new Date(doc.createdAt).toISOString().split('T')[0];
    dateMap.set(date, (dateMap.get(date) || 0) + (doc[field] || 1));
  });

  return Array.from(dateMap.entries())
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, count]) => ({ date, count }));
};

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

    const [allEvents, allBookings] = await Promise.all([
      Event.find().select('createdAt'),
      Booking.find().select('createdAt'),
    ]);

    res.json({
      totalUsers,
      totalEvents,
      totalBookings,
      totalRevenue,
      usersByRole,
      eventsByCategory,
      recentBookings,
      eventsOverTime: buildSeriesFromDocs(allEvents),
      bookingsOverTime: buildSeriesFromDocs(allBookings),
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

    const organizerBookings = await Booking.find({ event: { $in: eventIds } }).select('createdAt');

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
      eventsOverTime: buildSeriesFromDocs(events),
      bookingsOverTime: buildSeriesFromDocs(organizerBookings),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
