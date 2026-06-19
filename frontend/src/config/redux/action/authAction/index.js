import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/config";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/login', userData);
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/get_user_and_profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/update-profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchConnections = createAsyncThunk(
  "auth/fetchConnections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/connections');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchConnectionRequests = createAsyncThunk(
  "auth/fetchConnectionRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/requests');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendConnectionRequestAction = createAsyncThunk(
  "auth/sendConnectionRequest",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/user/send_connection_request/${userId}`);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const acceptConnectionRequestAction = createAsyncThunk(
  "auth/acceptConnectionRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/accept/${requestId}`);
      return { requestId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllUsersAction = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/all-users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadAvatarAction = createAsyncThunk(
  "auth/uploadAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/upload-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);