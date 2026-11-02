import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../store/authStore';

// <Route element={<RequireAuth />}> ... </Route>                              any signed-in user
// <Route element={<RequireAuth roles={['admin']} loginPath="/admin/login" />}> admin only
export default function RequireAuth({ roles, loginPath = '/login' }) {
  const { user, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return <p className="scx-loading">Loading…</p>;
  if (!user) return <Navigate to={loginPath} state={{ from: loc.pathname }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
