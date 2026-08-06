

import { getCartService } from "../service/cart.service";
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { cartFailure, cartStart, cartSuccess, clearError } from "../context/cart.slice";

function useCart (){
    
    const dispatch = useDispatch()

    const handleGetCart = async()=>{
        try {
            dispatch(cartStart())
            const response = await getCartService()
            console.log(response)
            dispatch(cartSuccess(response.data.cart))
            dispatch(clearError())
            
        } catch (error) {

               const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    dispatch(cartFailure(message));
    console.log("cannot register user" , error.message)
            
        }
     
    }

    return {
        handleGetCart
    }

}


export default useCart