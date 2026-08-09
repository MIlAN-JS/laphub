
import { useDispatch } from "react-redux"
import { categoryStart, categorySuccess, categoryFailure, clearError } from "../context/category.slice.js"
import { getAllCategoriesService } from "../service/category.api.js"



const useCategory = () => {
    const dispatch = useDispatch()


    const handleGetAllCategories = async () => {
        try {
            dispatch(categoryStart())
            const response = await getAllCategoriesService()
            dispatch(categorySuccess(response.data))
            dispatch(clearError())
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong";
            dispatch(categoryFailure(message))
            dispatch(clearError())
        }
    }


    return {
        handleGetAllCategories
    }
   

}


export default useCategory