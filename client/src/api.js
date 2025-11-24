// client/src/api.js

import axios from "axios";

// Create an Axios instance with the base URL for the FastAPI backend
export const api = axios.create({
  baseURL: "http://localhost:8000",
});