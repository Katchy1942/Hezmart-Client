import Axios  from "axios";
const axios = Axios.create({
    baseURL:import.meta.env.VITE_APP_BASE_URL_LOCAL,
    headers:{
        'X-Requested-with':'XMLHttpRequest'
    },
    withCredentials:true,
    withXSRFToken:true
});


export default axios;