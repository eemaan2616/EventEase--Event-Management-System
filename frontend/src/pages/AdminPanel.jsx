import { useEffect, useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiOutlineUsers, HiOutlineCalendar, HiOutlineChartBar, HiOutlineTrash } from 'react-icons/hi';

export default function AdminPanel() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, eventsRes, analyticsRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/events'),
        API.get('/analytics/admin'),
      ]);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
      setAnalytics(analyticsRes.data);
    } catch {
      toast.error('Failed to load admin data');
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/admin/users/${userId}`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await API.delete(`/events/${eventId}`);
      setEvents(events.filter(e => e._id !== eventId));
      toast.success('Event deleted');
    } catch {
      toast.error('Failed to delete event');
    }
  };

  if (loading) return <LoadingSpinner />;

  const tabs = [
    { id: 'users', label: 'Users', icon: HiOutlineUsers },
    { id: 'events', label: 'Events', icon: HiOutlineCalendar },
    { id: 'analytics', label: 'Analytics', icon: HiOutlineChartBar },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h1>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <t.icon size={18} /> {t.label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{u.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{u.email}</td>
                    <td className="px-5 py-3">
                      <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs capitalize bg-white">
                        <option value="attendee">Attendee</option>
                        <option value="organizer">Organizer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => handleDeleteUser(u._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                        <HiOutlineTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {tab === 'events' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Organizer</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map(e => (
                  <tr key={e._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{e.title}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{e.organizer?.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-500 capitalize">{e.category}</td>
                    <td className="px-5 py-3"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${e.status === 'upcoming' ? 'bg-green-100 text-green-700' : e.status === 'ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{e.status}</span></td>
                    <td className="px-5 py-3 text-sm text-gray-500">{new Date(e.date).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => handleDeleteEvent(e._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                        <HiOutlineTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {tab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-3xl font-bold text-primary-600">{analytics.totalUsers}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
              <p className="text-sm text-gray-500">Total Events</p>
              <p className="text-3xl font-bold text-green-600">{analytics.totalEvents}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-3xl font-bold text-blue-600">{analytics.totalBookings}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-3xl font-bold text-yellow-600">${analytics.totalRevenue}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Users by Role</h3>
              {analytics.usersByRole?.map(r => (
                <div key={r._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm capitalize text-gray-700">{r._id}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2"><div className="bg-primary-600 h-2 rounded-full" style={{ width: `${(r.count / analytics.totalUsers) * 100}%` }}></div></div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{r.count}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Events by Category</h3>
              {analytics.eventsByCategory?.map(c => (
                <div key={c._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm capitalize text-gray-700">{c._id}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: `${(c.count / analytics.totalEvents) * 100}%` }}></div></div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{c.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
