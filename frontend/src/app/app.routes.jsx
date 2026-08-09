import {createBrowserRouter} from "react-router-dom";
import App from "../app/App.jsx"
import RegisterPage from "../features/auth/ui/pages/RegisterPage.jsx";
import BuyerRegisterPage from "../features/auth/ui/pages/BuyerRegisterPage.jsx";
import SellerRegisterPage from "../features/auth/ui/pages/SellerRegisterPage.jsx";
import LoginPage from "../features/auth/ui/pages/LoginPage.jsx";
import VerifyPage from "../features/auth/ui/pages/VerifyPage.jsx";
import PublicLayout from "../layout/public.layout.jsx";
import PrivateLayout from "../layout/private.layout.jsx";
import CreateLaptopPage from "../features/laptop/ui/pages/CreateLaptopPage.jsx";
import Dashboard from "../features/laptop/ui/pages/Dashboard.jsx";
import LaptopDetails from "../features/laptop/ui/components/LaptopDetails.jsx";
import HomePage from "../features/laptop/ui/pages/HomePage.jsx";
import LaptopDetailPage from "../features/laptop/ui/pages/laptopDetailPage.jsx";
import CartPage from "../features/cart/ui/pages/CartPage.jsx";
import ChatsPage from "../features/chat/ui/pages/ChatsPage.jsx";
import OrdersPage from "../features/order/ui/pages/OrdersPage.jsx";
import ProfilePage from "../features/auth/ui/pages/ProfilePage.jsx";
import NewDashboard from "../features/laptop/ui/pages/NewDashboard.jsx";
import DashboardLayout from "../features/laptop/ui/layout/DashboardLayout.jsx";
import ManageLaptopsPage from "../features/laptop/ui/pages/ManageLaptopsPage.jsx";


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
                path : "laptop/detail/:productId",
                element : <LaptopDetailPage/>
            },
            {
                path : "create-laptop",
                element :<CreateLaptopPage/>
            }, 
            {
                path : "dashboard",
                element :<DashboardLayout/>,
                children : [
                    {
                        index : true,
                        element : <NewDashboard/>
                    },
                    {
                        path : "laptops",
                        element : <ManageLaptopsPage/>
                    }
                ]
            },
            {
                path : "laptop/view/:productId",
                element :<LaptopDetails/>
            },
            {
                path : "cart",
                element :<CartPage/>
            },
            {
                path : "chats",
                element :<ChatsPage/>
            },
            {
                path : "orders",
                element :<OrdersPage/>
            },
            {
                path : "profile",
                element :<ProfilePage/>
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
                children: [
                {
                    index: true,
                    element: <RegisterPage />,
                },
                {
                    path: "buyer",
                    element: <BuyerRegisterPage />,
                },
                {
                    path: "seller",
                    element: <SellerRegisterPage />,
                },
                ],
            },
            ],
        },
        {
            // Outside both layout groups on purpose: PublicLayout redirects
            // away as soon as state.auth.user is set, which happens right
            // after registration, before the user is actually verified.
            path: "verify",
            element: <VerifyPage />,
        },
        ],
    },
    ]);


