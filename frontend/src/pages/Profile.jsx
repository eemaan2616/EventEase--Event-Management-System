import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';
import { fetchMyBookings } from '../redux/slices/bookingSlice';
import { fetchMyEvents } from '../redux/slices/eventSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { bookings } = useSelector(state => state.bookings);
  const { myEvents } = useSelector(state => state.events);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    dispatch(fetchMyBookings());
    if (user?.role === 'organizer' || user?.role === 'admin') dispatch(fetchMyEvents());
  }, [user, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(form));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Profile updated!');
      setEditing(false);
    } else {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                  placeholder="+1 234 567 8900" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 text-sm">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 text-sm">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm"><HiOutlineMail className="text-gray-400" size={18} /><span className="text-gray-700">{user?.email}</span></div>
            <div className="flex items-center gap-3 text-sm"><HiOutlinePhone className="text-gray-400" size={18} /><span className="text-gray-700">{user?.phone || 'Not set'}</span></div>
            <button onClick={() => setEditing(true)} className="mt-4 px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 text-sm">Edit Profile</button>
          </div>
        )}
      </div>

      {/* Booking History */}
      {(user?.role === 'attendee' || user?.role === 'organizer') && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Booking History</h3>
          {bookings.length === 0 ? (
            <p className="text-sm text-gray-500">No bookings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Event</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Tier</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.slice(0, 10).map(b => (
                    <tr key={b._id}>
                      <td className="px-4 py-2">{b.event?.title || 'Event'}</td>
                      <td className="px-4 py-2">{b.ticketTier}</td>
                      <td className="px-4 py-2">${b.totalPrice}</td>
                      <td className="px-4 py-2"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.paymentStatus}</span></td>
                      <td className="px-4 py-2 text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Organizer Events */}
      {(user?.role === 'organizer' || user?.role === 'admin') && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">My Events</h3>
          {myEvents.length === 0 ? (
            <p className="text-sm text-gray-500">No events created yet.</p>
          ) : (
            <div className="space-y-3">
              {myEvents.slice(0, 10).map(event => (
                <div key={event._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Link to={`/events/${event._id}`} className="font-medium text-gray-900 hover:text-primary-600 text-sm">{event.title}</Link>
                    <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()} &bull; {event.category}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${event.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{event.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
