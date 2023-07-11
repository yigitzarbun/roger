import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ player: User; token: string }>
    ) => {
      console.log(action.payload);
      console.log("player");
      state.user = action.payload.player;
      state.token = action.payload.token;
      localStorage.setItem(
        "tennis_app_uer",
        JSON.stringify({
          user: action.payload.player,
          token: action.payload.token,
        })
      );
    },
    logOut: (state, action) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const selectCurrentUser = (state: RootState) => state.user;

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
