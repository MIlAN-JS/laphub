import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { authStart, authFailure , authSuccess , clearError } from '../context/auth.slice.js'
import { registerUser } from '../service/auth.api.js'
import { useNavigate } from 'react-router-dom'



const useAuth = ()=>{


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleRegister = async({fullName , contact , email , password , isSeller})=>{

        try {

        

            dispatch(authStart())
            const response = await registerUser({fullName , contact , email , password , isSeller});
            console.log("response of register user" , response)
            dispatch(authSuccess(response))
            navigate("/")
            
        } catch(error) {
            
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    dispatch(authFailure(message));
    console.log("cannot register usere" , error.message)
        }
    }


    return {handleRegister}




}


export default useAuth