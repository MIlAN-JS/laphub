import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";



export default function PublicLayout({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
}