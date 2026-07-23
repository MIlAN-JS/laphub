import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { authStart, authFailure , authSuccess , clearError } from '../context/auth.slice.js'
import { loginUserService, registerUser } from '../service/auth.api.js'
import { useNavigate } from 'react-router-dom'



const useAuth = ()=>{


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleRegister = async({fullName , contact , email , password , isSeller})=>{

        try {

        

            dispatch(authStart())
            const response = await registerUser({fullName , contact , email , password , isSeller});
            console.log("response of register user" , response)
            dispatch(authSuccess({
                user : response.user, 
                accessToken : response.accessToken
            }))
            navigate("/")
            
        } catch(error) {
            
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    dispatch(authFailure(message));
    console.log("cannot register user" , error.message)
        }
    }


    const handleLogin = async({email , password})=>{
        try {

            dispatch(authStart())
            const response = await loginUserService ({email, password});
            console.log("response of login user" , response)
            dispatch(authSuccess({
                user : response.user, 
                accessToken : response.accessToken
            }))
            navigate("/")

            
        } catch (error) {

         const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    dispatch(authFailure(message));
    console.log("cannot login user" , error.message)
            
        }
    }


    return {handleRegister , handleLogin}




}


export default useAuth