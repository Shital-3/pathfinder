import { Navigate, useLocation } from "react-router-dom";

export default function AdminRoute({ children, user, loading = false }) {
  const location = useLocation();

  if (loading) {
    return <div className="container admin-route-loading"><p>Checking administrator access...</p></div>;
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="container admin-route-denied">
        <p className="eyebrow">ADMINISTRATION</p>
        <h1>Access denied</h1>
        <p>You do not have permission to access the moderation dashboard.</p>
      </div>
    );
  }

  return children;
}
