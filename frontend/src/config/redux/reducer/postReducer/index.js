import { createSlice } from "@reduxjs/toolkit";
import { 
  fetchPosts, 
  createPost, 
  deletePost, 
  likePost, 
  commentPost,
  deleteComment
} from "../../action/postAction";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPosts: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        if (action.payload?.post) {
          // Verify that user is populated or at least present
          state.items.unshift(action.payload.post);
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter(post => post._id !== action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, userId } = action.payload;
        const post = state.items.find(p => p._id === postId);
        if (post) {
          if (!post.likes) post.likes = [];
          const idx = post.likes.indexOf(userId);
          if (idx > -1) {
            post.likes.splice(idx, 1);
            post.likesCount = Math.max(0, (post.likesCount || 1) - 1);
          } else {
            post.likes.push(userId);
            post.likesCount = (post.likesCount || 0) + 1;
          }
        }
      })
      .addCase(commentPost.fulfilled, (state, action) => {
        const updatedPost = action.payload?.post;
        if (updatedPost) {
          const index = state.items.findIndex(p => p._id === updatedPost._id);
          if (index > -1) {
            // Keep the populated userId details of comments if they were retrieved,
            // or replace it directly. The backend returns the populated comments.
            state.items[index] = updatedPost;
          }
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        const post = state.items.find(p => p._id === postId);
        if (post && post.comments) {
          post.comments = post.comments.filter(c => c._id !== commentId);
        }
      });
  },
});

export const { clearPosts } = postSlice.actions;
export default postSlice.reducer;
