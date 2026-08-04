import { useDispatch } from "react-redux"
import { laptopStart, laptopFailure, laptopSuccess, clearError, laptopSuccessSeller } from "../context/laptop.slice.js"
import { createLaptopProductService , getSellerLaptops , getLaptopDetail, getAllLaptopsService} from "../service/laptop.service.js"
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
            dispatch(laptopSuccessSeller(response.data))
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

    const handleGetLaptops = async({page , limit})=>{
        try {

            dispatch(laptopStart())
            const response = await getAllLaptopsService({page , limit});
            console.log(response)
            dispatch(laptopSuccess(response.data))
            dispatch(clearError())
            
        } catch (error) {
            const message = 
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
      console.log(error)
            dispatch(laptopFailure(message))
            dispatch(clearError())
            
        }
    }

    return {
        handleCreateLaptop, 
        handleGetSellerLaptops, 
        handleGetLaptopDetail, 
        handleGetLaptops
    }

}


export default useLaptop