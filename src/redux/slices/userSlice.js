import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/signup`,
        userData
      );

      if (response.status === 200) {
        toast.success(response.data.message, {
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
        });
      }

      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message,
        {
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
        }
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to login user
export const loginUser = createAsyncThunk(
  "user/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        loginData
      );
      localStorage.setItem("authToken", response.data.token);
      toast.success(response.data.message, {
        autoClose: 3000,
        pauseOnHover: false,
        draggable: false,
      });
      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message,
        {
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
        }
      );
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// Async thunk to fetch user data
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return rejectWithValue("No token found");
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/refetch`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      localStorage.removeItem("authToken");
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    error: null,
    userInfo: null,
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Fetch user
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.userInfo = null;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
