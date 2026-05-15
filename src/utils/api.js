import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:5000/api"
  baseURL:"https://smart-appointment-system-3ahc.onrender.com"
});

export default api;