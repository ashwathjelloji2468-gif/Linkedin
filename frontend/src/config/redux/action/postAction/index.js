import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/config";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/posts');
      return response.data; // Array of posts
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      // postData is an object like { body: "hello" }
      const response = await api.post('/posts/create', postData);
      return response.data; // { message, post }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/delete/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async ({ postId, userId }, { rejectWithValue }) => {
    try {
      await api.post(`/posts/like/${postId}`);
      return { postId, userId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const commentPost = createAsyncThunk(
  "posts/commentPost",
  async ({ postId, commentText }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/posts/comment/${postId}`, { comment: commentText });
      return response.data; // { message, post }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${postId}/comments/${commentId}`);
      return { postId, commentId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
