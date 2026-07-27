import {createBrowserRouter} from "react-router-dom";
import App from "../app/App.jsx"
import RegisterComponent from "../features/auth/ui/components/RegisterComponent.jsx";
import RegisterPage from "../features/auth/ui/pages/RegisterPage.jsx";
import LoginPage from "../features/auth/ui/pages/LoginPage.jsx";
import PublicLayout from "../layout/public.layout.jsx";
import PrivateLayout from "../layout/private.layout.jsx";


export const router = createBrowserRouter([


    {
        path:"/",
        element:<PrivateLayout><App/></PrivateLayout>
    }, 
    {
        path : "/login",
        element :
        <PublicLayout>
       <LoginPage/>
        </PublicLayout>
       
    }, 
    {
        path : "/register",
        element : 
        <PublicLayout> <RegisterPage/></PublicLayout>
       
    }

])



