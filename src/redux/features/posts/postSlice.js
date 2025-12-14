"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ================= FETCH POSTS ================= */
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

/* ================= CREATE POST (IMAGE + DATA) ================= */
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      let imageUrl = "";

      if (postData.image) {
        const formData = new FormData();
        formData.append("image", postData.image);

        const uploadRes = await fetch("/api/posts/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) return rejectWithValue(uploadData);

        imageUrl = uploadData.urlով
        imageUrl = uploadData.url;
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postData.title,
          body: postData.body,
          author: postData.author,
          tags: postData.tags,
          image: imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return data;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

/* ================= UPDATE POST ================= */
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ slug, data }) => {
    const res = await fetch(`/api/posts/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Update failed");
    return await res.json();
  }
);

/* ================= DELETE POST ================= */
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (slug) => {
    const res = await fetch(`/api/posts/${slug}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Delete failed");
    return slug;
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.posts || action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Create post failed";
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.list = state.list.map((post) =>
          post.slug === action.payload.slug ? action.payload : post
        );
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (post) => post.slug !== action.payload
        );
      });
  },
});

export default postSlice.reducer;
