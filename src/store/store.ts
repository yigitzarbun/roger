import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { apiSlice } from "../api/apiSlice";
import currentUserReducer from "./slices/currentUserSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    currentUser: currentUserReducer,
    api: apiSlice.reducer,
  },
});
console.log("Initial store state:", store.getState());

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
