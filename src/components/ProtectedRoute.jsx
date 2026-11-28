import { Navigate, useLocation, Outlet } from '../lib/router-compat';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-ivory">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-wine border-t-transparent animate-spin mx-auto mb-3" />
          <p className="font-heading text-sm font-semibold text-wine">Verifying Host Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to /login and preserve the return location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}
