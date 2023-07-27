import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

import { apiSlice } from "./auth/apiSlice";
import authReducer from "./slices/authSlice";

import { locationsSlice } from "../api/endpoints/LocationsApi";
import { playerLevelsSlice } from "../api/endpoints/PlayerLevelsApi";
import { userTypesSlice } from "../api/endpoints/UserTypesApi";
import { userStatusTypesSlice } from "../api/endpoints/UserStatusTypesApi";
import { playersSlice } from "../api/endpoints/PlayersApi";
import { clubsSlice } from "../api/endpoints/ClubsApi";
import { clubTypesSlice } from "../api/endpoints/ClubTypesApi";
import { trainersSlice } from "../api/endpoints/TrainersApi";
import { trainerExperienceTypesSlice } from "../api/endpoints/TrainerExperienceTypesApi";
import { trainerEmploymentTypesSlice } from "../api/endpoints/TrainerEmploymentTypesApi";
import { courtsSlice } from "../api/endpoints/CourtsApi";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [locationsSlice.reducerPath]: locationsSlice.reducer,
    [playerLevelsSlice.reducerPath]: playerLevelsSlice.reducer,
    [userTypesSlice.reducerPath]: userTypesSlice.reducer,
    [userStatusTypesSlice.reducerPath]: userStatusTypesSlice.reducer,
    [playersSlice.reducerPath]: playersSlice.reducer,
    [clubsSlice.reducerPath]: clubsSlice.reducer,
    [clubTypesSlice.reducerPath]: clubTypesSlice.reducer,
    [trainersSlice.reducerPath]: trainersSlice.reducer,
    [trainerExperienceTypesSlice.reducerPath]:
      trainerExperienceTypesSlice.reducer,
    [trainerEmploymentTypesSlice.reducerPath]:
      trainerEmploymentTypesSlice.reducer,
    [courtsSlice.reducerPath]: courtsSlice.reducer,
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
      .concat(playersSlice.middleware)
      .concat(clubsSlice.middleware)
      .concat(clubTypesSlice.middleware)
      .concat(trainersSlice.middleware)
      .concat(trainerExperienceTypesSlice.middleware)
      .concat(trainerEmploymentTypesSlice.middleware)
      .concat(courtsSlice.middleware),
});

// Infer the `RootState` type from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);
