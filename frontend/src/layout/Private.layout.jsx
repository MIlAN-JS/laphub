import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar/Navbar";
export default function PrivateLayout() {
  const { user, isLoading, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify" replace />;
  }

  return (
    <div>
      <Navbar/>
      <Outlet />
    </div>
  );
}