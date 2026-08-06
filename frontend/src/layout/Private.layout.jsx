
      import { Navigate, Outlet } from "react-router-dom";
  import { useSelector } from "react-redux";
  import Navbar from "../components/Navbar.jsx";

  export default function PrivateLayout() {

    const { user, isLoading, error } = useSelector((state) => state.auth);

    if (isLoading) {
      return <h1>Loading...</h1>;
    }



    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  }