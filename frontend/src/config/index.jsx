import axios from "axios";

const clientServerConfig = axios.create({
  baseURL: "http://localhost:9080/api",
  withCredentials: true,
});

export default clientServerConfig;