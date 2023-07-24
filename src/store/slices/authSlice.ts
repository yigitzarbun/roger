import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocalStorageKeys } from "../../common/constants/lsConstants";
import { RootState } from "store/store";

export interface User {
  user?: {
    user_id: number;
    email: string;
    password: string;
    registered_at: string;
    user_type_id: number;
    user_status_type_id: number;
  };

  playerDetails?: {
    player_id: number;
    fname: string;
    lname: string;
    birt_year: string;
    gender: string;
    image: string;
    location_id: number;
    phone_number: number;
    player_bio_description: string;
    player_level_id: number;
    user_id: number;
  };

  trainerDetails?: {
    birth_year: string;
    club_id: number;
    fname: string;
    gender: string;
    image: string;
    lname: string;
    location_id: number;
    phone_number: number;
    price_hour: number;
    trainer_bio_description: string;
    trainer_employment_type_id: number;
    trainer_experience_type_id: number;
    trainer_id: number;
    user_id: number;
  };
  clubDetails?: {
    club_address: string;
    club_bio_description: string;
    club_id: number;
    club_name: string;
    club_type_id: number;
    location_id: number;
    picture: string;
    user_id: number;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export function getUserFromLs() {
  const userString = localStorage.getItem(LocalStorageKeys.user);
  if (userString) {
    const { user, token } = JSON.parse(userString);
    return { user, token };
  }
  return null;
}

const initialState: AuthState = {
  ...getUserFromLs(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem(
        LocalStorageKeys.user,
        JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
        })
      );
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem(LocalStorageKeys.user);
    },
  },
});

export const selectCurrentUser = (state: RootState) => state.user;

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
