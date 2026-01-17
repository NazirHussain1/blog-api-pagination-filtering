"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page = 1, limit = 5, author = "", tag = "", sort = "newest" }) => {
    let url = `/api/posts?limit=${limit}&page=${page}&sort=${sort}`;
    if (author) url += `&author=${author}`;
    if (tag) url += `&tag=${tag}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return await res.json();
  }
);

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/posts/myposts", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch your posts");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ slug, data }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      if (!res.ok) return rejectWithValue(updated);
      return updated;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      return slug;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

export const fetchSinglePost = createAsyncThunk(
  "posts/fetchSinglePost",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/posts/${slug}`);
      if (!res.ok) throw new Error("Post not found");
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/posts/${slug}/like`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to like");
      return data; // { isLiked, likes }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const incrementViews = createAsyncThunk(
  "posts/incrementViews",
  async (slug, { rejectWithValue }) => {
    try {
      await fetch(`/api/posts/${slug}/view`, { method: "POST", credentials: "include" });
      return slug;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    list: [],
    userPosts: [],
    singlePost: null, 
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.posts || action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch posts";
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.userPosts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch your posts";
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
        state.userPosts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Create post failed";
      })
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((post) =>
          post.slug === action.payload.slug ? action.payload : post
        );
        state.userPosts = state.userPosts.map((post) =>
          post.slug === action.payload.slug ? action.payload : post
        );
        if (state.singlePost?.slug === action.payload.slug) {
          state.singlePost = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Update post failed";
      })
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((post) => post.slug !== action.payload);
        state.userPosts = state.userPosts.filter((post) => post.slug !== action.payload);
        if (state.singlePost?.slug === action.payload) state.singlePost = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Delete post failed";
      })

          .addCase(fetchSinglePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSinglePost.fulfilled, (state, action) => {
        state.loading = false;
        state.singlePost = action.payload;
      })
      .addCase(fetchSinglePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch post";
      })
      .addCase(likePost.fulfilled, (state, action) => {
        if (state.singlePost) state.singlePost.likes = action.payload.likes;
      })
      .addCase(incrementViews.fulfilled, (state, action) => {
        if (state.singlePost) state.singlePost.views = (state.singlePost.views || 0) + 1;
      });
  },
});

export const { clearError } = postSlice.actions;
export default postSlice.reducer;
