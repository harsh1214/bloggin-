import axios from "axios";

const api = axios.create({
    // baseURL: "http://localhost:8080",
    baseURL: "https://bloggin-8mqt.onrender.com",
    withCredentials: true
})

export default api;