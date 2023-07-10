import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getLocallySavedAuthToken = () => {
  return localStorage.getItem("token") || "";
};

const getLocallySavedUserData = () => {
  const userDataString = localStorage.getItem("user");
  if (userDataString) {
    return JSON.parse(userDataString);
  }
  return null;
};

export interface AuthState {
  authToken: string;
  isLoggedIn: boolean;
  userData: any;
}

const INITIAL_STATE: AuthState = {
  authToken: getLocallySavedAuthToken(),
  isLoggedIn: false,
  userData: getLocallySavedUserData(),
};

const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
    setLoggedIn: (state) => {
      state.isLoggedIn = true;
      state.userData = getLocallySavedUserData();
      console.log("User data after login:", state.userData);
      setUserDataToLocalstorage(state);
    },
    setLoggedOut: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
      console.log("User data after logout:", state.userData);
      clearUserDataFromLocalstorage();
    },
  },
});

export const { setAuthToken, setLoggedIn, setLoggedOut } = authSlice.actions;

export default authSlice.reducer;

const setUserDataToLocalstorage = (state: AuthState) => {
  localStorage.setItem("user", JSON.stringify(state.userData));
};

const clearUserDataFromLocalstorage = () => {
  localStorage.removeItem("user");
};
