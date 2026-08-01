import { useDispatch } from "react-redux"
import { laptopStart, laptopFailure, laptopSuccess, clearError } from "../context/laptop.slice.js"
import { createLaptopProductService } from "../service/laptop.service.js"
const useLaptop = () => {

    const dispatch = useDispatch()


    const handleCreateLaptop = async ({title, description, battery, brand, display, thumbnail, variants, variantImage}) => {
        try {
            dispatch(laptopStart())
            const response = await createLaptopProductService({title, description, battery, brand, display, thumbnail, variants, variantImage})
            console.log(response)
            dispatch(laptopSuccess(response))
            dispatch(clearError())
        } catch (error) {
            const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
            dispatch(laptopFailure(message))
            dispatch(clearError())
        }
    }


    return {
        handleCreateLaptop
    }

}


export default useLaptop