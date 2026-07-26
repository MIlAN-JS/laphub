import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { authStart, authFailure , authSuccess , clearError } from '../context/auth.slice.js'
import { loginUserService, registerUser } from '../service/auth.api.js'
import { useNavigate } from 'react-router-dom'



const useAuth = ()=>{


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleRegister = async({username  , email , password , isSeller})=>{

        try {

        

            dispatch(authStart())
            const response = await registerUser({username  , email , password , isSeller});
            console.log("response of register user" , response)
            dispatch(authSuccess({
                user : response.data.user, 
                accessToken : response.data.accessToken
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


   


    return {handleRegister}




}


export default useAuth