import axios from 'axios';

const API_URL = 'http://localhost:5000/api/favorites';  // Adjust this URL as needed for your environment

export const addFavorite = async (userId, postId) => {
  try {
    const response = await axios.post(`${API_URL}/add`, { userId, postId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add favorite");
  }
};

export const removeFavorite = async (userId, postId) => {
  try {
    const response = await axios.post(`${API_URL}/remove`, { userId, postId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to remove favorite");
  }
};

export const getUserFavorites = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch favorites");
  }
};
