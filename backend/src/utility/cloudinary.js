import { v2 as cloudinary } from 'cloudinary';
import fs from"fs"
import Cloudinary from '../config/cloudinary.config.js';
import { loadEnvFile } from 'process';




const uploadOnCloudinary = async(localFilePath)=>{
    try {

        if(!localFilePath){
            throw new Error ("Cannot find local file path")
        }

        //upload file on cloudinary 

        const uploadResult = await cloudinary.uploader
       .upload(localFilePath ,  {
               resource_type : "auto"
           }
       )


       // file has beeen uploaded 

       console.log(uploadResult , "file is uploaded successfully in cloudinary")

       fs.unlinkSync(localFilePath)

       return uploadResult.url
         
        
    } catch (error) {

        // cleaning the files in our server
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed

        throw new Error (error)
        
    }
}



export default uploadOnCloudinary


