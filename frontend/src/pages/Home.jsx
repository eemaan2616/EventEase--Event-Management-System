import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../redux/slices/eventSlice';
import { HiOutlineCalendar, HiOutlineUsers, HiOutlineTicket, HiOutlineArrowRight, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';

const categories = [
  { name: 'Conference', value: 'conference', color: 'bg-blue-100 text-blue-700', icon: '🎤' },
  { name: 'Workshop', value: 'workshop', color: 'bg-green-100 text-green-700', icon: '🛠️' },
  { name: 'Seminar', value: 'seminar', color: 'bg-purple-100 text-purple-700', icon: '📚' },
  { name: 'Concert', value: 'concert', color: 'bg-pink-100 text-pink-700', icon: '🎵' },
  { name: 'Sports', value: 'sports', color: 'bg-orange-100 text-orange-700', icon: '⚽' },
  { name: 'Other', value: 'other', color: 'bg-gray-100 text-gray-700', icon: '🎉' },
];

export default function Home() {
  const dispatch = useDispatch();
  const { events } = useSelector(state => state.events);

  useEffect(() => {
    dispatch(fetchEvents({ limit: 6, status: 'upcoming' }));
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Discover & Book <br />
              <span className="text-primary-200">Amazing Events</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl">
              Find conferences, workshops, concerts, and more. Book tickets instantly and never miss out on the experiences that matter to you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/events" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                Browse Events <HiOutlineArrowRight />
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
          <p className="text-gray-500 mt-2">Find the perfect event for you</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link key={cat.value} to={`/events?category=${cat.value}`}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all bg-white group">
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
              <p className="text-gray-500 mt-2">Don&apos;t miss out on these events</p>
            </div>
            <Link to="/events" className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1 text-sm">
              View All <HiOutlineArrowRight />
            </Link>
          </div>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <Link key={event._id} to={`/events/${event._id}`}
                  className="group bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                  <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <HiOutlineCalendar className="text-white/50" size={64} />
                  </div>
                  <div className="p-5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 mb-2 capitalize">{event.category}</span>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 mb-2 line-clamp-1">{event.title}</h3>
                    <div className="space-y-1.5">
                      <p className="text-sm text-gray-500 flex items-center gap-1.5"><HiOutlineClock size={14} /> {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5"><HiOutlineLocationMarker size={14} /> {event.location}</p>
                    </div>
                    {event.tickets?.length > 0 && (
                      <p className="mt-3 text-lg font-bold text-primary-600">
                        From ${Math.min(...event.tickets.map(t => t.price))}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <HiOutlineCalendar className="mx-auto mb-3" size={48} />
              <p>No upcoming events yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to organize your event?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">Join as an organizer and start creating amazing events. Reach thousands of attendees on our platform.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
            Get Started <HiOutlineArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
