import { v2 as cloudinary } from 'cloudinary';
import fs from fs
import Cloudinary from '../config/cloudinary.config.js';




const uploadOnCloudinary = async(localFilePath)=>{
    try {

        if(!localFilePath){
            throw new Error ("Cannot find local file path")
        }

        //upload file on cloudinary 

        const uploadResult = await cloudinary.uploader
       .upload(localFilePath ,  {
               public_id: 'avatar',
               resource_type : "auto"
           }
       )


       // file has beeen uploaded 

       console.log(uploadResult , "file is uploaded successfully in cloudinary")

       return uploadResult.url
         
        
    } catch (error) {

        // cleaning the files in our server
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed

        throw new Error (error)
        return null ; 
        
    }
}



export {uploadOnCloudinary}


