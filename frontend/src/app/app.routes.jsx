import {createBrowserRouter} from "react-router-dom";
import App from "../app/App.jsx"
import RegisterComponent from "../features/auth/ui/components/RegisterComponent.jsx";
import RegisterPage from "../features/auth/ui/pages/RegisterPage.jsx";
import LoginPage from "../features/auth/ui/pages/LoginPage.jsx";
import PublicLayout from "../layout/public.layout.jsx";
import PrivateLayout from "../layout/private.layout.jsx";
import CreateLaptopPage from "../features/laptop/ui/pages/CreateLaptopPage.jsx";


    export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
        {
            element: <PrivateLayout />,
            children: [
            {
                index: true,
                element: <h1>Home</h1>,
            },
            {
                path : "create-laptop",
                element :<CreateLaptopPage/>
            }
            ],
        },
        
        {
            element: <PublicLayout />,
            children: [
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage />,
            },
            ],
        },
        ],
    },
    ]);


