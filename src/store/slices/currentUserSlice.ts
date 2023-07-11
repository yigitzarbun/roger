import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

enum LsKeys {
  currentUser = "currentUser",
}

export interface CurrentUser {
  birth_year: string;
  email: string;
  fname: string;
  gender: string;
  image: string | null;
  level: string;
  lname: string;
  location: string;
  password: string;
  player_id: number;
  player_status: string;
  registered_at: string;
  user_type: string;
}

interface CurrentUserState {
  currentUser: CurrentUser | null;
}

const loadCurrentUserFromLs = (): CurrentUser | null => {
  const storedCurrentUser = localStorage.getItem(LsKeys.currentUser);
  if (storedCurrentUser) {
    return JSON.parse(storedCurrentUser);
  }
  return null;
};

const initialState: CurrentUserState = {
  currentUser: loadCurrentUserFromLs(),
};

export const currentUserSlice = createSlice({
  name: "currentUserSlice",
  initialState,
  reducers: {
    addCurrentUser: (state, action: PayloadAction<CurrentUser>) => {
      console.log(action.payload);
      state.currentUser = action.payload;
      localStorage.setItem(LsKeys.currentUser, JSON.stringify(action.payload));
    },

    logoutCurrentUser: (state) => {
      console.log("logoutCurrentUser reducer is called");
      console.log("Current state:", state);

      state.currentUser = null;
      localStorage.removeItem(LsKeys.currentUser);
    },
  },
});

export const { addCurrentUser, logoutCurrentUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;
