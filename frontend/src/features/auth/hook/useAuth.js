import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { authStart, authFailure , authSuccess , clearError, authVerify, logout  } from '../context/auth.slice.js'
import { loginUserService, logoutUserService, refreshToken, registerBuyerUser, registerSellerService, verifyUserService } from '../service/auth.api.js'
import { useNavigate } from 'react-router-dom'




const useAuth = ()=>{


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleBuyerRegister = async({username  , email , password })=>{

        try {
            dispatch(authStart())
            const response = await registerBuyerUser({username  , email , password });
            dispatch(authSuccess({
                user : response?.data?.user,
                accessToken : response?.data?.accessToken
            }))
            navigate("/verify" , { state : { email } })

        } catch(error) {

    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    dispatch(authFailure(message));
    console.log("cannot register user" , error.message)
        }
    }

    const handleSellerRegister = async({email , password, storeName , storeNumber , businessType, panNumber, panImage, country,  state,  city,  street, postalCode})=>{

        try {
            dispatch(authStart())
            const response = await registerSellerService({email , password, storeName , storeNumber , businessType, panNumber, panImage, country,  state,  city,  street, postalCode});
            dispatch(authSuccess({
                user : response?.data?.user,
                accessToken : response?.data?.accessToken
            }))
            console.log(response)
            navigate("/verify" , { state : { email } })

        } catch(error) {

    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    dispatch(authFailure(message));
    console.log("cannot register user" , error.message)
        }

    }

    const handleVerify = async ({email, code }) => {
        try {
        dispatch(authStart())
        const response = await verifyUserService({email, code});
        console.log(response)
        dispatch(authVerify({user : response?.data?.user , accessToken : response.data?.accessToken}))
        console.log(("success bro "))
        navigate("/")
        } catch (error) {
            const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    dispatch(authFailure(message));
    console.log("cannot register user" , error.message)

        }
    }

   const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_LOCAL_GOOGLE_URL;
  };
    const handleLogin = async({email , password})=>{
        try {
            dispatch(authStart())
            const response = await loginUserService({email , password });
            console.log("response of login user" , response)
            dispatch(authSuccess({
                user : response.data.user, 
                accessToken : response.data.accessToken
            }))
            navigate("/")
            
        } catch (error) {
              const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    dispatch(authFailure(message));
    console.log("cannot register user" , error.message)
        }
        
    }
    const handleRefresh = async()=>{

        try {

        

            dispatch(authStart())
            const response = await refreshToken();
            console.log("response of register user" , response)
            dispatch(authSuccess({
                user : response.data.user, 
                accessToken : response.data.accessToken
            }))
            
        } catch(error) {
            
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    dispatch(authFailure(message));
    console.log("cannot get refresh token" , error.message)
        }
    }

    const handleLogout = async ()=>{
        try {
            await logoutUserService()
        } catch (error) {
            console.log("cannot logout user" , error.message)
        } finally {
            // Always clear local session, even if the server call failed,
            // so the user is never stuck "logged in" on their own device.
            dispatch(logout())
            navigate("/login")
        }
    }

    // const handleGetUser = async()=>{
    //     try {

    //         dispatch(authStart())
    //         const response = await getUserService();
    //         console.log("response of get user" , response)
    //         dispatch(authSuccess({
    //             user : response.data.user, 
    //             accessToken : response.data.accessToken
    //         }))
            
            
    //     } catch (error) {
       
    // const message =
    //   error.response?.data?.message ||
    //   error.message ||
    //   "Something went wrong";

    // dispatch(authFailure(message));
    // console.log("cannot get user " , error.message)
    //     }

            
        
    // }


   


    const handleClearError = ()=>{
        dispatch(clearError())
    }

    return {handleBuyerRegister , handleSellerRegister , handleVerify , handleRefresh , handleLogin , handleClearError , handleGoogleLogin , handleLogout }




}


export default useAuth