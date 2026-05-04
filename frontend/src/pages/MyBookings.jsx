import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings } from '../redux/slices/bookingSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { HiOutlineTicket, HiOutlineDownload, HiOutlineCalendar } from 'react-icons/hi';

export default function MyBookings() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector(state => state.bookings);

  useEffect(() => { dispatch(fetchMyBookings()); }, [dispatch]);

  const handleDownload = async (bookingId, ticketId) => {
    try {
      const response = await API.get(`/bookings/${bookingId}/ticket`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${ticketId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error('Failed to download ticket. Ensure payment is completed.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <HiOutlineTicket className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg font-medium">No bookings yet</p>
          <p className="text-gray-400 text-sm mb-4">Start exploring events and book your first ticket!</p>
          <Link to="/events" className="text-primary-600 font-medium hover:text-primary-700">Browse Events</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <HiOutlineCalendar className="text-white" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/events/${booking.event?._id}`} className="text-lg font-semibold text-gray-900 hover:text-primary-600 line-clamp-1">{booking.event?.title || 'Event'}</Link>
                <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                  <span>{booking.ticketTier} &times; {booking.quantity}</span>
                  <span>&bull;</span>
                  <span>${booking.totalPrice}</span>
                  <span>&bull;</span>
                  <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1 font-mono">ID: {booking.ticketId}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {booking.paymentStatus}
                </span>
                {booking.paymentStatus === 'paid' && (
                  <button onClick={() => handleDownload(booking._id, booking.ticketId)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" title="Download Ticket">
                    <HiOutlineDownload size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
