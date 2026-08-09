import { useDispatch } from "react-redux"
import { laptopStart, laptopFailure, laptopSuccess, clearError, laptopSuccessSeller } from "../context/laptop.slice.js"
import { createLaptopProductService , getSellerLaptops , getLaptopDetail, getAllLaptopsService, addVariantService, searchLaptopsService} from "../service/laptop.service.js"
import { useNavigate } from "react-router-dom"
const useLaptop = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleCreateLaptop = async ({title, description, battery, brand, display, categoryId, thumbnail, variants, variantImage}) => {
        try {
            dispatch(laptopStart())
            const response = await createLaptopProductService({title, description, battery, brand, display, categoryId, thumbnail, variants, variantImage})
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

    // Deliberately doesn't touch the shared laptop.isLoading/error state —
    // this runs from a modal on top of an already-loaded detail page, and
    // laptopFailure() would wipe laptopData and blank the page out from
    // under the user if the submission fails.
    const handleAddVariant = async(laptopId, variantData)=>{
        return await addVariantService(laptopId, variantData);
    }

    // Returns the pagination info from the response so the results page can
    // drive prev/next without the laptop slice needing to know about it.
    const handleSearchLaptops = async({q, brand, categoryId, page, limit})=>{
        try {

            dispatch(laptopStart())
            const response = await searchLaptopsService({q, brand, categoryId, page, limit});
            dispatch(laptopSuccess(response.data.laptops))
            dispatch(clearError())
            return response.data.pagination

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
        handleGetLaptopDetail,
        handleGetLaptops,
        handleAddVariant,
        handleSearchLaptops
    }

}


export default useLaptop