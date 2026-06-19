import { createSlice } from "@reduxjs/toolkit";
import { 
  loginUser, 
  registerUser, 
  fetchUserProfile, 
  updateProfile,
  fetchConnections,
  fetchConnectionRequests,
  fetchAllUsersAction,
  uploadAvatarAction
} from "../../action/authAction";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  profileFetching: false,
  connections: [],
  connectionRequests: [],
  allUsers: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    logout: (state) => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload?.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileFetching = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileFetching = false;
        state.user = action.payload.user;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileFetching = false;
        state.user = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (action.payload?.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.connections = action.payload || [];
      })
      .addCase(fetchConnectionRequests.fulfilled, (state, action) => {
        state.connectionRequests = action.payload || [];
      })
      .addCase(fetchAllUsersAction.fulfilled, (state, action) => {
        state.allUsers = action.payload?.users || [];
      })
      .addCase(uploadAvatarAction.fulfilled, (state, action) => {
        if (state.user && action.payload?.profilePicture) {
          state.user.profilePicture = action.payload.profilePicture;
        }
      });
  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;