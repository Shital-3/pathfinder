import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, user, loading = false }) {
  const location = useLocation();

  if (loading) return <div className="container"><p>Checking your session...</p></div>;
  if (!user) return <Navigate to="/signin" replace state={{ from: location.pathname }} />;

  return children;
}
