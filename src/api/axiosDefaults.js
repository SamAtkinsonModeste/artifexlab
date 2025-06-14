import axios from "axios";

axios.defaults.baseURL = "https://artifexlab-api-d4e6d81a8b08.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();
