
      import { Navigate, Outlet } from "react-router-dom";
  import { useSelector } from "react-redux";

  export default function PrivateLayout() {
    
    const { user, isLoading, error } = useSelector((state) => state.auth);

    if (isLoading) {
      return <h1>Loading...</h1>;
    }



    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  }