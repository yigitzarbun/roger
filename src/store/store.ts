import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

import { apiSlice } from "./auth/apiSlice";
import authReducer from "./slices/authSlice";

import { locationsSlice } from "../api/endpoints/LocationsApi";
import { playerLevelsSlice } from "../api/endpoints/PlayerLevelsApi";
import { userTypesSlice } from "../api/endpoints/UserTypesApi";
import { userStatusTypesSlice } from "../api/endpoints/UserStatusTypesApi";
import { playersSlice } from "../api/endpoints/PlayersApi";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [locationsSlice.reducerPath]: locationsSlice.reducer,
    [playerLevelsSlice.reducerPath]: playerLevelsSlice.reducer,
    [userTypesSlice.reducerPath]: userTypesSlice.reducer,
    [userStatusTypesSlice.reducerPath]: userStatusTypesSlice.reducer,
    [playersSlice.reducerPath]: playersSlice.reducer,
    user: authReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(locationsSlice.middleware)
      .concat(playerLevelsSlice.middleware)
      .concat(userTypesSlice.middleware)
      .concat(userStatusTypesSlice.middleware)
      .concat(playersSlice.middleware),
});

// Infer the `RootState` type from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);
