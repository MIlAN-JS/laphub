    import { useSelector } from "react-redux";
    import { Navigate } from "react-router-dom";
    export default function PrivateLayout({ children }) {
    const { user, loading } = useSelector((state) => state.auth);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
    }