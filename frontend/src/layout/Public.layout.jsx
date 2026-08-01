import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";



export default function PublicLayout() {
  const { user, isLoading } = useSelector((state) => state.auth);

  console.log("inside public ")

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}