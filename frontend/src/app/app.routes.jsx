import {createBrowserRouter} from "react-router-dom";
import App from "../app/App.jsx"
import RegisterComponent from "../features/auth/ui/components/RegisterComponent.jsx";
import RegisterPage from "../features/auth/ui/pages/RegisterPage.jsx";
import LoginPage from "../features/auth/ui/pages/LoginPage.jsx";
import PublicLayout from "../layout/public.layout.jsx";
import PrivateLayout from "../layout/private.layout.jsx";
import CreateLaptopPage from "../features/laptop/ui/pages/CreateLaptopPage.jsx";
import Dashboard from "../features/laptop/ui/pages/Dashboard.jsx";
import LaptopDetails from "../features/laptop/ui/components/LaptopDetails.jsx";
import HomePage from "../features/laptop/ui/pages/HomePage.jsx";


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
                element: <HomePage/>,
            },
            {
                path : "create-laptop",
                element :<CreateLaptopPage/>
            }, 
            {
                path : "dashboard",
                element :<Dashboard/>
            }, 
            {
                path : "laptop/view/:productId",
                element :<LaptopDetails/>
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


