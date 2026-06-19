import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.items.unshift(action.payload);
    },
    setPosts: (state, action) => {
      state.items = action.payload;
    },
    clearPosts: () => initialState,
  },
});

export const { addPost, setPosts, clearPosts } = postSlice.actions;
export default postSlice.reducer;
