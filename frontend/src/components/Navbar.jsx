import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiOutlineBell, HiOutlineMenu, HiOutlineX, HiOutlineUser, HiOutlineLogout, HiOutlineCalendar } from 'react-icons/hi';
import { logout } from '../redux/slices/authSlice';
import { fetchNotifications, markAsRead, markAllAsRead } from '../redux/slices/notificationSlice';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { notifications, unreadCount } = useSelector(state => state.notifications);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    if (user) dispatch(fetchNotifications());
  }, [user, dispatch]);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-3">
            {user && (
              <button onClick={onToggleSidebar} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden">
                {sidebarOpen ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <HiOutlineCalendar className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900">EventHub</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/events" className="text-gray-600 hover:text-primary-600 font-medium text-sm">Events</Link>
            <Link to="/blogs" className="text-gray-600 hover:text-primary-600 font-medium text-sm">Blog</Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary-600 font-medium text-sm">Contact</Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="relative" ref={notifRef}>
                  <button onClick={() => setShowNotif(!showNotif)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 relative">
                    <HiOutlineBell size={22} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unreadCount}</span>
                    )}
                  </button>
                  {showNotif && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                      <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                          <button onClick={() => dispatch(markAllAsRead())} className="text-xs text-primary-600 hover:text-primary-700">Mark all read</button>
                        )}
                      </div>
                      <div className="overflow-y-auto max-h-72">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-sm text-gray-500 text-center">No notifications</p>
                        ) : (
                          notifications.slice(0, 10).map(n => (
                            <div key={n._id} onClick={() => { if (!n.read) dispatch(markAsRead(n._id)); }}
                              className={`p-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 ${!n.read ? 'bg-primary-50' : ''}`}>
                              <p className="text-sm text-gray-700">{n.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative" ref={profileRef}>
                  <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100">
                    <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>
                  </button>
                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <HiOutlineUser size={16} /> Dashboard
                      </Link>
                      <Link to="/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <HiOutlineUser size={16} /> Profile
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                        <HiOutlineLogout size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
