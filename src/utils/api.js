import axios from 'axios';

const BASE_URL = "https://my-checkin-app.up.railway.app/my-checkin"

export const registerUser = async ({ username, password, email }) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, { 
            username, 
            password, 
            email 
        });
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

export const loginUser = async ({ email, password }) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, { 
            email, 
            password 
        });
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}