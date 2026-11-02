import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../store/authStore';
export default function RequireAuth({ roles, loginPath = '/login' }) {
  const user = useAuth((s) => s.user);
  const location = useLocation();
  if (!user) return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/account" replace />;
  return <Outlet />;
}
