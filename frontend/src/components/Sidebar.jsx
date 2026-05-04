import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HiOutlineHome, HiOutlineCalendar, HiOutlineTicket, HiOutlinePlus,
  HiOutlineUser, HiOutlineDocumentText, HiOutlineChartBar, HiOutlineUsers,
  HiOutlineMail
} from 'react-icons/hi';

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  const { user } = useSelector(state => state.auth);

  const isActive = (path) => location.pathname === path;

  const baseLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
    { to: '/events', label: 'Browse Events', icon: HiOutlineCalendar },
  ];

  const attendeeLinks = [
    { to: '/my-bookings', label: 'My Bookings', icon: HiOutlineTicket },
  ];

  const organizerLinks = [
    { to: '/my-bookings', label: 'My Bookings', icon: HiOutlineTicket },
    { to: '/create-event', label: 'Create Event', icon: HiOutlinePlus },
    { to: '/blogs/create', label: 'Write Blog', icon: HiOutlineDocumentText },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Panel', icon: HiOutlineUsers },
    { to: '/create-event', label: 'Create Event', icon: HiOutlinePlus },
    { to: '/blogs/create', label: 'Write Blog', icon: HiOutlineDocumentText },
  ];

  const commonLinks = [
    { to: '/profile', label: 'Profile', icon: HiOutlineUser },
    { to: '/blogs', label: 'Blog', icon: HiOutlineDocumentText },
    { to: '/contact', label: 'Contact', icon: HiOutlineMail },
  ];

  let roleLinks = attendeeLinks;
  if (user?.role === 'organizer') roleLinks = organizerLinks;
  if (user?.role === 'admin') roleLinks = adminLinks;

  const allLinks = [...baseLinks, ...roleLinks, ...commonLinks];

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-primary-50 text-primary-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 flex flex-col gap-1 h-full overflow-y-auto">
          <div className="mb-2 px-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
          </div>
          {allLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={onClose} className={linkClass(link.to)}>
              <link.icon size={20} />
              {link.label}
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
