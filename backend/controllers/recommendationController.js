const Booking = require('../models/Booking');
const Event = require('../models/Event');

const tokenize = (value) =>
  (value || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);

exports.getRecommendations = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;

    const userBookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title category')
      .sort({ createdAt: -1 })
      .limit(30);

    const bookedEventIds = userBookings
      .map((booking) => booking.event?._id)
      .filter(Boolean);

    const categorySet = new Set();
    const keywordSet = new Set();

    userBookings.forEach((booking) => {
      if (!booking.event) return;
      if (booking.event.category) categorySet.add(booking.event.category);
      tokenize(booking.event.title).forEach((token) => keywordSet.add(token));
    });

    if (categorySet.size === 0 && keywordSet.size === 0) {
      const fallbackEvents = await Event.find({ status: { $in: ['upcoming', 'ongoing'] } })
        .sort({ 'tickets.sold': -1, createdAt: -1 })
        .limit(limit)
        .populate('organizer', 'name');
      return res.json({ recommendations: fallbackEvents, reason: 'fallback' });
    }

    const keywordClauses = Array.from(keywordSet).map((keyword) => ({
      title: { $regex: keyword, $options: 'i' },
    }));

    const query = {
      _id: { $nin: bookedEventIds },
      status: { $in: ['upcoming', 'ongoing'] },
      $or: [
        { category: { $in: Array.from(categorySet) } },
        ...keywordClauses,
      ],
    };

    let recommendations = await Event.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('organizer', 'name');

    if (recommendations.length < limit) {
      const fillCount = limit - recommendations.length;
      const existingIds = recommendations.map((event) => event._id);
      const extraEvents = await Event.find({
        _id: { $nin: [...bookedEventIds, ...existingIds] },
        status: { $in: ['upcoming', 'ongoing'] },
      })
        .sort({ 'tickets.sold': -1, createdAt: -1 })
        .limit(fillCount)
        .populate('organizer', 'name');
      recommendations = [...recommendations, ...extraEvents];
    }

    res.json({ recommendations, reason: 'history' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
