import axios from "axios";
import Swal from "sweetalert2";

// Set base URL for API calls (previous)
// axios.defaults.baseURL = "http://mentor.test/api";
// export default axios;


//Latest
const api = axios.create({
    baseURL: 'http://mentor.test/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authotization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `API Error: ${error.response ? error.response.data.message : error.message}`,
        });
        return Promise.reject(error);
    }
);

export default api;

//Latest
