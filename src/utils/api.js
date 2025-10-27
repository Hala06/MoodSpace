import axios from 'axios';

const BASE_URL = "http://localhost:8080/my-checkin"

export const registerUser = async ({ username, password, email }) => {
    const response = await axios.post(`${BASE_URL}/register`, { username, password, email });
    return response.data; // Returns Account objsect
}

export const loginUser = async ({ email, password }) => {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response.data; // Returns JWT token
}