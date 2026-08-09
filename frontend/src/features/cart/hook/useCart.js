

import { getCartService, addToCartService, removeCartItemService } from "../service/cart.service";
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

    // Doesn't dispatch cartStart/cartFailure so a failed add doesn't wipe
    // cartData out from under the cart icon dropdown or cart page if either
    // is open elsewhere — the caller (the button) owns its own loading/error
    // state and this just syncs global cart state on success.
    const handleAddToCart = async(productId, variantId, quantity)=>{
        const response = await addToCartService(productId, variantId, quantity)
        dispatch(cartSuccess(response.data.cart))
        return response
    }

    // Same reasoning as handleAddToCart: no cartStart/cartFailure dispatch,
    // caller owns the per-item loading/error UI.
    const handleRemoveCartItem = async(itemId)=>{
        const response = await removeCartItemService(itemId)
        dispatch(cartSuccess(response.data.cart))
        return response
    }

    return {
        handleGetCart,
        handleAddToCart,
        handleRemoveCartItem
    }

}


export default useCart