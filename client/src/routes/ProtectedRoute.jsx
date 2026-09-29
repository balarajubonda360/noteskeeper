import { Navigate, Outlet } from "react-router-dom";
import Skeleton from "../components/ui/Skeleton.jsx";
import useAuth from "../hooks/useAuth.js";

/** Keep private routes hidden until the saved session has been restored. */
export function ProtectedRoute() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink px-6">
        <div className="glass w-full max-w-md space-y-5 rounded-2xl p-7">
          <Skeleton className="h-8 w-2/5" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </main>
    );
  }

  return user && token ? <Outlet /> : <Navigate to="/login" replace />;
}

/** Keep signed-in users out of login and registration pages. */
export function PublicRoute() {
  const { user, token, loading } = useAuth();
  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-ink"><Skeleton className="h-40 w-80" /></main>;
  }
  return user && token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
