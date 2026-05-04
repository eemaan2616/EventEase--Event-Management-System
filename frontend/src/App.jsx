import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import ProtectedDashboardLayout from './layouts/ProtectedDashboardLayout';
import { RoleRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import CreateBlog from './pages/CreateBlog';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route element={<ProtectedDashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/booking/:eventId" element={<Booking />} />
        <Route path="/create-event" element={<RoleRoute roles={['organizer', 'admin']}><CreateEvent /></RoleRoute>} />
        <Route path="/edit-event/:id" element={<RoleRoute roles={['organizer', 'admin']}><EditEvent /></RoleRoute>} />
        <Route path="/blogs/create" element={<RoleRoute roles={['organizer', 'admin']}><CreateBlog /></RoleRoute>} />
        <Route path="/admin" element={<RoleRoute roles={['admin']}><AdminPanel /></RoleRoute>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
