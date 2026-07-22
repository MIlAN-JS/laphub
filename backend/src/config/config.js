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
    JWT_ACCESS_SECRET : process.env.JWT_ACCESS_SECRET

}






export default config;