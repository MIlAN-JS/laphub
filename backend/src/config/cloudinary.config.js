import cloudinary from "cloudinary"
import config from "./config.js";
    
    
   const Cloudinary =  cloudinary.config({ 
        cloud_name: config.CLOUDINARY_CLOUD_NAME, 
        api_key: config.CLOUDINARY_API_KEY, 
        api_secret: config.CLOUDINARY_API_SECRET
    });

  export default Cloudinary