import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyBookings } from '../redux/slices/bookingSlice';
import { fetchMyEvents } from '../redux/slices/eventSlice';
import API from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiOutlineCalendar, HiOutlineTicket, HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlinePlus } from 'react-icons/hi';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}><Icon size={22} /></div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCharts({ eventsOverTime = [], bookingsOverTime = [] }) {
  const eventData = eventsOverTime.map((item) => ({
    ...item,
    label: item.date?.slice(5) || item.date,
  }));
  const bookingData = bookingsOverTime.map((item) => ({
    ...item,
    label: item.date?.slice(5) || item.date,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Events Created Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={eventData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Bookings Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function RecommendedSection() {
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  useEffect(() => {
    let mounted = true;
    API.get('/recommendations?limit=4')
      .then((res) => {
        if (mounted) setRecommendations(res.data.recommendations || []);
      })
      .catch(() => {
        if (mounted) setRecommendations([]);
      })
      .finally(() => {
        if (mounted) setLoadingRecommendations(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
      <h3 className="font-semibold text-gray-900 mb-4">Recommended for You</h3>
      {loadingRecommendations ? (
        <p className="text-sm text-gray-500">Loading recommendations...</p>
      ) : recommendations.length === 0 ? (
        <p className="text-sm text-gray-500">No recommendations yet. Explore events to get personalized suggestions.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              <p className="text-sm font-semibold text-gray-900 line-clamp-1">{event.title}</p>
              <p className="text-xs text-gray-500 capitalize mt-1">{event.category}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(event.date).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function AttendeeDashboard() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector(state => state.bookings);

  useEffect(() => { dispatch(fetchMyBookings()); }, [dispatch]);

  if (loading) return <LoadingSpinner />;

  const upcoming = bookings.filter(b => b.event && new Date(b.event.date) > new Date());
  const totalSpent = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalPrice, 0);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Bookings" value={bookings.length} icon={HiOutlineTicket} color="bg-primary-100 text-primary-600" />
        <StatCard title="Upcoming" value={upcoming.length} icon={HiOutlineCalendar} color="bg-green-100 text-green-600" />
        <StatCard title="Total Spent" value={`$${totalSpent}`} icon={HiOutlineCurrencyDollar} color="bg-yellow-100 text-yellow-600" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Bookings</h3>
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-sm">No bookings yet. <Link to="/events" className="text-primary-600">Browse Events</Link></p>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map(b => (
              <div key={b._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <Link to={`/events/${b.event?._id}`} className="font-medium text-gray-900 hover:text-primary-600 text-sm">{b.event?.title || 'Event'}</Link>
                  <p className="text-xs text-gray-500">{b.ticketTier} &bull; {new Date(b.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${b.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.paymentStatus}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <RecommendedSection />
    </div>
  );
}

function OrganizerDashboard() {
  const dispatch = useDispatch();
  const { myEvents, loading } = useSelector(state => state.events);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    dispatch(fetchMyEvents());
    API.get('/analytics/organizer').then(res => setAnalytics(res.data)).catch(() => {});
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="My Events" value={analytics?.totalEvents || myEvents.length} icon={HiOutlineCalendar} color="bg-primary-100 text-primary-600" />
        <StatCard title="Total Bookings" value={analytics?.totalBookings || 0} icon={HiOutlineTicket} color="bg-green-100 text-green-600" />
        <StatCard title="Revenue" value={`$${analytics?.totalRevenue || 0}`} icon={HiOutlineCurrencyDollar} color="bg-yellow-100 text-yellow-600" />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">My Events</h3>
        <Link to="/create-event" className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
          <HiOutlinePlus size={16} /> Create Event
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {myEvents.length === 0 ? (
          <p className="text-gray-500 text-sm p-6">No events yet. Create your first event!</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Event</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Bookings</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myEvents.map(event => {
                const stats = analytics?.eventsWithBookings?.find(e => e._id === event._id);
                return (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{event.title}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="px-5 py-3"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${event.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{event.status}</span></td>
                    <td className="px-5 py-3 text-sm text-gray-500">{stats?.bookings || 0}</td>
                    <td className="px-5 py-3"><Link to={`/edit-event/${event._id}`} className="text-primary-600 text-sm hover:underline">Edit</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <AnalyticsCharts
        eventsOverTime={analytics?.eventsOverTime || []}
        bookingsOverTime={analytics?.bookingsOverTime || []}
      />
      <RecommendedSection />
    </div>
  );
}

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/analytics/admin').then(res => { setAnalytics(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Users" value={analytics?.totalUsers || 0} icon={HiOutlineUsers} color="bg-primary-100 text-primary-600" />
        <StatCard title="Total Events" value={analytics?.totalEvents || 0} icon={HiOutlineCalendar} color="bg-green-100 text-green-600" />
        <StatCard title="Total Bookings" value={analytics?.totalBookings || 0} icon={HiOutlineTicket} color="bg-blue-100 text-blue-600" />
        <StatCard title="Revenue" value={`$${analytics?.totalRevenue || 0}`} icon={HiOutlineCurrencyDollar} color="bg-yellow-100 text-yellow-600" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Users by Role</h3>
          <div className="space-y-3">
            {analytics?.usersByRole?.map(r => (
              <div key={r._id} className="flex items-center justify-between">
                <span className="text-sm capitalize text-gray-700">{r._id}</span>
                <span className="text-sm font-semibold text-gray-900">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Events by Category</h3>
          <div className="space-y-3">
            {analytics?.eventsByCategory?.map(c => (
              <div key={c._id} className="flex items-center justify-between">
                <span className="text-sm capitalize text-gray-700">{c._id}</span>
                <span className="text-sm font-semibold text-gray-900">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AnalyticsCharts
        eventsOverTime={analytics?.eventsOverTime || []}
        bookingsOverTime={analytics?.bookingsOverTime || []}
      />
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Bookings</h3>
        <div className="space-y-3">
          {analytics?.recentBookings?.map(b => (
            <div key={b._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-900">{b.user?.name}</p>
                <p className="text-xs text-gray-500">{b.event?.title}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">${b.totalPrice}</p>
                <p className="text-xs text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <Link to="/admin" className="text-primary-600 font-medium hover:text-primary-700 text-sm">Go to Admin Panel &rarr;</Link>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useSelector(state => state.auth);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-500 text-sm capitalize">{user?.role} Dashboard</p>
      </div>
      {user?.role === 'admin' ? <AdminDashboard /> : user?.role === 'organizer' ? <OrganizerDashboard /> : <AttendeeDashboard />}
    </div>
  );
}
