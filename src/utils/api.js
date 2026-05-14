import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-appointment-system-3ahc.onrender.com"
});

export default api;