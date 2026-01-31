import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (err) {
      return rejectWithValue({ error: err.message });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (err) {
      return rejectWithValue({ error: err.message });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (err) {
      return rejectWithValue({ error: err.message });
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Logout failed");
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleFollowUser = createAsyncThunk(
  "auth/toggleFollowUser",
  async ({ targetUserId }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user) throw new Error("Not logged in");

      const res = await fetch(`/api/users/follow/${targetUserId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Follow action failed");
      return targetUserId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(toggleFollowUser.pending, (state) => {
        // Don't set loading for follow actions to avoid UI blocking
        state.error = null;
      })
      .addCase(toggleFollowUser.fulfilled, (state, action) => {
        // Don't set loading false since we didn't set it true
        const targetUserId = action.payload;
        if (!state.user.following) state.user.following = [];
        if (state.user.following.includes(targetUserId)) {
          state.user.following = state.user.following.filter((id) => id !== targetUserId);
        } else {
          state.user.following.push(targetUserId);
        }
      })
      .addCase(toggleFollowUser.rejected, (state, action) => {
        // Don't set loading false since we didn't set it true
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.payload;
      });
  },
});

export default authSlice.reducer;
