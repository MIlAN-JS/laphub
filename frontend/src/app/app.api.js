import store from "./store.js";
import axios from "axios";
const api = axios.create({
    baseURL : "/api/v1", 
    withCredentials : true
})

api.interceptors.request.use((config) => {

    const token = store.getState().auth.accessToken;

   console.log("hello world")
    console.log(config)

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api