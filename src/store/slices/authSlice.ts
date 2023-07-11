import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getLocallySavedUserData = () => {
  const userDataString = localStorage.getItem("user");
  if (userDataString) {
    return JSON.parse(userDataString);
  }
  return null;
};

export interface UserData {
  email: string;
  password: string;
}
export interface AuthState {
  isLoggedIn: boolean;
  userData: UserData;
}

const INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  userData: getLocallySavedUserData(),
};

const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: {
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

export const { setLoggedIn, setLoggedOut } = authSlice.actions;

export default authSlice.reducer;

const setUserDataToLocalstorage = (state: AuthState) => {
  localStorage.setItem("user", JSON.stringify(state.userData));
};

const clearUserDataFromLocalstorage = () => {
  localStorage.removeItem("user");
};
