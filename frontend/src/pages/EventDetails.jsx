import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvent, clearEvent } from '../redux/slices/eventSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineClock, HiOutlineUser, HiOutlineTicket } from 'react-icons/hi';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';

export default function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { event, loading } = useSelector(state => state.events);
  const { user } = useSelector(state => state.auth);
  const shareUrl = window.location.href;

  useEffect(() => {
    dispatch(fetchEvent(id));
    return () => dispatch(clearEvent());
  }, [dispatch, id]);

  if (loading || !event) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="h-64 md:h-80 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="text-center text-white relative">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm mb-4 capitalize">{event.category}</span>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">{event.title}</h1>
          <p className="text-primary-100">by {event.organizer?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h2>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{event.description}</p>
          </div>

          {/* Ticket Tiers */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tickets</h2>
            <div className="space-y-3">
              {event.tickets?.map((tier) => (
                <div key={tier._id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors">
                  <div>
                    <h3 className="font-semibold text-gray-900">{tier.tier}</h3>
                    <p className="text-sm text-gray-500">{tier.quantity - tier.sold} of {tier.quantity} remaining</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary-600">${tier.price}</p>
                    {tier.sold >= tier.quantity && <span className="text-xs text-red-500 font-medium">Sold Out</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Share This Event</h2>
            <div className="flex gap-3">
              <FacebookShareButton url={shareUrl}><FacebookIcon size={40} round /></FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={event.title}><TwitterIcon size={40} round /></TwitterShareButton>
              <WhatsappShareButton url={shareUrl} title={event.title}><WhatsappIcon size={40} round /></WhatsappShareButton>
              <button onClick={() => { navigator.clipboard.writeText(shareUrl); }}
                className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 text-sm font-medium">
                Link
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20">
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center"><HiOutlineCalendar className="text-primary-600" size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium text-gray-900">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              {event.endDate && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><HiOutlineClock className="text-blue-600" size={20} /></div>
                  <div>
                    <p className="text-xs text-gray-500">Ends</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(event.endDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><HiOutlineLocationMarker className="text-green-600" size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">{event.location}</p>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline">View on Map</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><HiOutlineUser className="text-purple-600" size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500">Organizer</p>
                  <p className="text-sm font-medium text-gray-900">{event.organizer?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"><HiOutlineTicket className="text-yellow-600" size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{event.status}</p>
                </div>
              </div>
            </div>
            {user ? (
              <Link to={`/booking/${event._id}`}
                className="w-full block text-center py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Book Now
              </Link>
            ) : (
              <Link to="/login"
                className="w-full block text-center py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Login to Book
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
