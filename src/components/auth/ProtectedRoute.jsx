import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // ✅ Check if user is authenticated AND has the required token
  const token = localStorage.getItem("token");
  if (!user || !token) {
    if (allowedRoles?.includes("restaurant"))
      return <Navigate to="/restaurant/login" replace />;
    if (allowedRoles?.includes("admin"))
      return <Navigate to="/admin/login" replace />;
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Wrong role — kick them to homepage, not their own dashboard
    return <Navigate to="/" replace />;
  }

  return children;
};
export default ProtectedRoute;
