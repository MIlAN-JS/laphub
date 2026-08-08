import dotenv from "dotenv";

dotenv.config();


if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined");
}

if(!process.env.JWT_REFRESH_SECRET){
    throw new Error("JWT_REFRESH_SECRET is not defined");
}

if(!process.env.JWT_ACCESS_SECRET){
    throw new Error("JWT_ACCESS_SECRET is not defined");
}



const config = {

    MONGO_URI : process.env.MONGO_URI, 
    JWT_REFRESH_SECRET : process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_SECRET : process.env.JWT_ACCESS_SECRET,
    PORT : process.env.PORT,
    CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME, 
    CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY, 
    CLOUDINARY_URL : process.env.CLOUDINARY_URL, 
    NODE_ENV : process.env.NODE_ENV, 
    RESEND_API_KEY : process.env.RESEND_API_KEY,
    VERIFICATION_CODE_HASH_SECRET : process.env.VERIFICATION_CODE_HASH_SECRET,
    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL : process.env.GOOGLE_CALLBACK_URL, 
    FACEBOOK_CLIENT_ID : process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET : process.env.FACEBOOK_CLIENT_SECRET,
    FACEBOOK_CALLBACK_URL : process.env.FACEBOOK_CALLBACK_URL

}








export default config;