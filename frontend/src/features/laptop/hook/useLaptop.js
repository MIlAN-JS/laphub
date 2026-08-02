import { useDispatch } from "react-redux"
import { laptopStart, laptopFailure, laptopSuccess, clearError } from "../context/laptop.slice.js"
import { createLaptopProductService , getSellerLaptops , getLaptopDetail} from "../service/laptop.service.js"
import { useNavigate } from "react-router-dom"
const useLaptop = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleCreateLaptop = async ({title, description, battery, brand, display, thumbnail, variants, variantImage}) => {
        try {
            dispatch(laptopStart())
            const response = await createLaptopProductService({title, description, battery, brand, display, thumbnail, variants, variantImage})
            console.log(response)
            dispatch(laptopSuccess(response))
            dispatch(clearError())
            navigate("/dashboard")
        } catch (error) {
            const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
            dispatch(laptopFailure(message))
            dispatch(clearError())
        }
    }


    const handleGetSellerLaptops = async()=>{
        try {

            dispatch(laptopStart())
            const response = await getSellerLaptops();
            console.log(response , "laptopdata")
            dispatch(laptopSuccess(response.data))
            dispatch(clearError())
            
        } catch (error) {
            

        }
    
    
   
    }

     const handleGetLaptopDetail = async(laptopId)=>{
        try {

            dispatch(laptopStart())
            const response = await getLaptopDetail(laptopId);
            dispatch(laptopSuccess(response.data))
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
        handleCreateLaptop, 
        handleGetSellerLaptops, 
        handleGetLaptopDetail
    }

}


export default useLaptop