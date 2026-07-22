import {createBrowserRouter} from "react-router-dom";
import App from "../app/App.jsx"
import RegisterComponent from "../features/auth/ui/components/RegisterComponent.jsx";
import RegisterPage from "../features/auth/ui/pages/RegisterPage.jsx";


export const router = createBrowserRouter([


    {
        path:"/",
        element:<App/>
    }, 
    {
        path : "/login ",
        element : <h1>Login</h1>
    }, 
    {
        path : "/register",
        element : <RegisterPage/>
    }

])



