import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function ProtectedRoute({ children }) {
  const { user } = useSelector(state => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  return children || <Outlet />;
}

export function RoleRoute({ children, roles }) {
  const { user } = useSelector(state => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}
