import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocalStorageKeys } from "../../common/constants/lsConstants";
import { RootState } from "store/store";

export interface User {
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

export interface AuthState {
  user: User | null;
  token: string | null;
}

export function getUserFromLs() {
  const userString = localStorage.getItem(LocalStorageKeys.user);
  if (userString) {
    const user = JSON.parse(userString);
    return user.user || null;
  }
  return null;
}

const initialState: AuthState = {
  user: getUserFromLs(),
  token: null,
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
