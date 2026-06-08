import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { LoadingState } from './QueryStates';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState label="Đang kiểm tra phiên đăng nhập..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
