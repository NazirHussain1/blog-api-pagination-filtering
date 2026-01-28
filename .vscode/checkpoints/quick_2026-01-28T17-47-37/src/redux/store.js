import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import postReducer from "./features/posts/postSlice"; // already created

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
  },
});
