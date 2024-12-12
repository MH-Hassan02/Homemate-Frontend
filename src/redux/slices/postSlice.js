// // src/redux/slices/postSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Async thunk to fetch post by ID
// export const fetchPostById = createAsyncThunk(
//   "posts/fetchPostById",
//   async (id) => {
//     const response = await axios.get(
//       `${import.meta.env.VITE_BASE_URL}/posts/post/${id}`
//     );
//     return response.data;
//   }
// );

// // Async thunk to fetch user favorites
// export const fetchUserFavorites = createAsyncThunk(
//   "posts/fetchUserFavorites",
//   async (userId, { rejectWithValue }) => {
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       return rejectWithValue("No token found");
//     }
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_BASE_URL}/api/favorites/${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data.favorites;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // Async thunk to add a post to favorites
// export const addFavorite = createAsyncThunk(
//   "posts/addFavorite",
//   async ({ postId, userId }, { rejectWithValue }) => {
//     const token = localStorage.getItem("authToken");

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/api/favorites/add`,
//         { userId, postId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Something went wrong!"
//       );
//     }
//   }
// );

// // Async thunk to remove a post from favorites
// export const removeFavorite = createAsyncThunk(
//   "posts/removeFavorite",
//   async ({ postId, userId }, { rejectWithValue }) => {
//     const token = localStorage.getItem("authToken");
//     try {
//       await axios.delete(
//         `${import.meta.env.VITE_BASE_URL}/api/favorites/remove`,
//         {
//           data: { userId, postId },
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return postId;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Something went wrong!"
//       );
//     }
//   }
// );

// const postSlice = createSlice({
//   name: "posts",
//   initialState: {
//     post: null,
//     favorites: [],
//     status: "idle",
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Handle fetching post by ID
//       .addCase(fetchPostById.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchPostById.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.post = action.payload;
//       })
//       .addCase(fetchPostById.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       })
//       // Handle fetching user favorites
//       .addCase(fetchUserFavorites.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserFavorites.fulfilled, (state, action) => {
//         state.loading = false;
//         state.favorites = action.payload;
//       })
//       .addCase(fetchUserFavorites.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || action.error.message;
//       })
//       // Handle adding a favorite
//       .addCase(addFavorite.fulfilled, (state, action) => {
//         state.favorites.push(action.payload);
//       })
//       // Handle removing a favorite
//       .addCase(removeFavorite.fulfilled, (state, action) => {
//         state.favorites = state.favorites.filter(
//           (favorite) => favorite._id !== action.payload
//         );
//       });
//   },
// });

// export default postSlice.reducer;

// src/redux/slices/postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch post by ID
export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/posts/post/${id}`
    );
    return response.data;
  }
);

// Async thunk to fetch user favorites
export const fetchUserFavorites = createAsyncThunk(
  "posts/fetchUserFavorites",
  async (userId, { rejectWithValue }) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return rejectWithValue("No token found");
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/favorites/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.favorites;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to add a post to favorites
export const addFavorite = createAsyncThunk(
  "posts/addFavorite",
  async ({ postId, userId }, { rejectWithValue }) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/favorites/add`,
        { userId, postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong!"
      );
    }
  }
);

// Async thunk to remove a post from favorites
export const removeFavorite = createAsyncThunk(
  "posts/removeFavorite",
  async ({ postId, userId }, { rejectWithValue }) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/favorites/remove`,
        {
          data: { userId, postId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return postId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong!"
      );
    }
  }
);

// New async thunk to fetch posts by area
export const fetchPostsByArea = createAsyncThunk(
  "posts/fetchPostsByArea",
  async (area, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/posts/search?area=${area}`
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.response?.data || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    post: null,
    favorites: [],
    postsByArea: [],
    status: "idle",
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.post = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Handle fetching user favorites
      .addCase(fetchUserFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Handle adding a favorite
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites.push(action.payload);
      })
      // Handle removing a favorite
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(
          (favorite) => favorite._id !== action.payload
        );
      })
      // Handle fetching posts by area
      .addCase(fetchPostsByArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsByArea.fulfilled, (state, action) => {
        state.loading = false;
        state.postsByArea = action.payload;
      })
      .addCase(fetchPostsByArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default postSlice.reducer;
