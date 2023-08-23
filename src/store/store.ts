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
import { courtStructureTypesSlice } from "../api/endpoints/CourtStructureTypesApi";
import { courtSurfaceTypesSlice } from "../api/endpoints/CourtSurfaceTypesApi";
import { bookingsSlice } from "../api/endpoints/BookingsApi";
import { eventTypesSlice } from "../api/endpoints/EventTypesApi";
import { favouritesSlice } from "../api/endpoints/FavouritesApi";
import { clubSubscriptionTypesSlice } from "../api/endpoints/ClubSubscriptionTypesApi";
import { clubSubscriptionPackagesSlice } from "../api/endpoints/ClubSubscriptionPackagesApi";
import { clubSubscriptionsSlice } from "../api/endpoints/ClubSubscriptionsApi";
import { clubStaffRoleTypesSlice } from "../api/endpoints/ClubStaffRoleTypesApi";
import { clubStaffSlice } from "../api/endpoints/ClubStaffApi";
import { paymentTypesSlice } from "../api/endpoints/PaymentTypesApi";
import { paymentsSlice } from "../api/endpoints/PaymentsApi";
import { banksSlice } from "../api/endpoints/BanksApi";
import { matchScoresSlice } from "../api/endpoints/MatchScoresApi";
import { matchScoresStatusTypesSlice } from "../api/endpoints/MatchScoresStatusTypesApi";
import { studentsSlice } from "../api/endpoints/StudentsApi";

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
    [courtStructureTypesSlice.reducerPath]: courtStructureTypesSlice.reducer,
    [courtSurfaceTypesSlice.reducerPath]: courtSurfaceTypesSlice.reducer,
    [bookingsSlice.reducerPath]: bookingsSlice.reducer,
    [eventTypesSlice.reducerPath]: eventTypesSlice.reducer,
    [favouritesSlice.reducerPath]: favouritesSlice.reducer,
    [clubSubscriptionTypesSlice.reducerPath]:
      clubSubscriptionTypesSlice.reducer,
    [clubSubscriptionPackagesSlice.reducerPath]:
      clubSubscriptionPackagesSlice.reducer,
    [clubSubscriptionsSlice.reducerPath]: clubSubscriptionsSlice.reducer,
    [clubStaffRoleTypesSlice.reducerPath]: clubStaffRoleTypesSlice.reducer,
    [clubStaffSlice.reducerPath]: clubStaffSlice.reducer,
    [paymentTypesSlice.reducerPath]: paymentTypesSlice.reducer,
    [paymentsSlice.reducerPath]: paymentsSlice.reducer,
    [banksSlice.reducerPath]: banksSlice.reducer,
    [matchScoresSlice.reducerPath]: matchScoresSlice.reducer,
    [matchScoresStatusTypesSlice.reducerPath]:
      matchScoresStatusTypesSlice.reducer,
    [studentsSlice.reducerPath]: studentsSlice.reducer,
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
      .concat(courtsSlice.middleware)
      .concat(courtStructureTypesSlice.middleware)
      .concat(courtSurfaceTypesSlice.middleware)
      .concat(bookingsSlice.middleware)
      .concat(eventTypesSlice.middleware)
      .concat(favouritesSlice.middleware)
      .concat(clubSubscriptionTypesSlice.middleware)
      .concat(clubSubscriptionPackagesSlice.middleware)
      .concat(clubSubscriptionsSlice.middleware)
      .concat(clubStaffRoleTypesSlice.middleware)
      .concat(clubStaffSlice.middleware)
      .concat(paymentTypesSlice.middleware)
      .concat(paymentsSlice.middleware)
      .concat(banksSlice.middleware)
      .concat(matchScoresSlice.middleware)
      .concat(matchScoresStatusTypesSlice.middleware)
      .concat(studentsSlice.middleware),
});

// Infer the `RootState` type from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);
