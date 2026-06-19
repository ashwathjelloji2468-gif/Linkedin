import User from "../models/users.models.js";
import Profile from "../models/profile.models.js"; 
import Post from "../models/posts.models.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    // 1. Validation
    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await newUser.save();

    // 5. Create associated Profile
    // We use newUser._id to link the profile to the newly created user
    const newProfile = new Profile({
      userId: newUser._id,
    });
    await newProfile.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "RUNNING!!" });
};
//1. createn post:
export const createPost = async (req, res) => {
  try {
    // 1. Extract 'body' from the request
    const { body } = req.body;
    
    // 2. Fallback userId for testing
    const userId = req.user ? req.user.id : "64b0f9a2b8e3a2c4e8d1a1b1";

    // 3. Validation: Check if 'body' exists
    if (!body) {
      return res.status(400).json({ message: "Post content (body) is required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // 4. Create new post using the 'body' field
    const newPost = new Post({
      userId,
      body, 
    });

    await newPost.save();

    return res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Create post error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//2. get all posts: 
export const getAllPosts = async (req, res) => {
  try {
    // 1. Find all posts and populate the 'userId' field with user info
    //    We exclude sensitive fields like 'password'
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate("userId", "name username profilePicture headline");

    // 2. Return the posts
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getAllPosts:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
//3.delete posts:
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; // From your protectRoute middleware

    // 1. Find the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 2. Check ownership: Does the logged-in user own this post?
    // Note: We use .toString() because userId might be an object
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: You can only delete your own posts" });
    }

    // 3. Delete the post
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in deletePost:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
//4. comment on a post:
export const commentPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id; // From protectRoute middleware

    if (!comment) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    // 1. Update the post by pushing the new comment into the array
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            userId: userId,
            text: comment,
            createdAt: new Date()
          }
        }
      },
      { new: true } // Returns the document after the update
    ).populate("comments.userId", "name profilePicture");

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Comment added successfully",
      post: updatedPost
    });
  } catch (error) {
    console.error("Error in commentPost:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
//5. get comments by post:
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // 1. Find the post and populate the 'userId' inside the 'comments' array
    const post = await Post.findById(postId)
      .populate("comments.userId", "name username profilePicture")
      .select("comments"); // We only need the comments field

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 2. Return the comments array
    res.status(200).json(post.comments);
  } catch (error) {
    console.error("Error in getCommentsByPost:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
//6. delete comments:
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id; // From protectRoute middleware

    // 1. Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 2. Find the specific comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // 3. Check ownership: Only the comment author can delete it
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: You can only delete your own comments" });
    }

    // 4. Remove the comment using Mongoose's .pull() or .deleteOne()
    post.comments.pull(commentId);
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error in deleteComment:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
//7. increment likes:
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user already liked the post
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike: Remove userId from likes array and decrement count
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
        $inc: { likesCount: -1 }
      });
      return res.status(200).json({ message: "Post unliked" });
    } else {
      // Like: Add userId to likes array and increment count
      await Post.findByIdAndUpdate(postId, {
        $addToSet: { likes: userId },
        $inc: { likesCount: 1 }
      });
      return res.status(200).json({ message: "Post liked" });
    }
  } catch (error) {
    console.error("Error in likePost:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};