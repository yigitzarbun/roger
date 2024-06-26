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
    language_id: number;
  };

  playerDetails?: {
    player_id: number;
    fname: string;
    lname: string;
    birth_year: string;
    gender: string;
    image: string;
    location_id: number;
    phone_number: number;
    player_bio_description: string;
    player_level_id: number;
    is_premium: boolean;
    name_on_card: string;
    card_number: number;
    cvc: number;
    user_id: number;
  };

  trainerDetails?: {
    trainer_id: number;
    fname: string;
    lname: string;
    birth_year: string;
    gender: string;
    price_hour: number;
    phone_number: number;
    image: string;
    trainer_bio_description: string;
    iban: number;
    bank_id: string;
    name_on_bank_account: string;
    is_premium: boolean;
    club_id: number;
    trainer_experience_type_id: number;
    location_id: number;
    trainer_employment_type_id: number;
    user_id: number;
  };

  clubDetails?: {
    club_id: number;
    image: string;
    club_address: string;
    club_bio_description: string;
    club_name: string;
    is_premium: boolean;
    phone_number: number;
    iban: number;
    bank_id: string;
    name_on_bank_account: string;
    is_player_subscription_required: boolean;
    is_player_lesson_subscription_required: boolean;
    is_trainer_subscription_required: boolean;
    location_id: number;
    club_type_id: number;
    user_id: number;
  };

  clubStaffDetails?: {
    club_staff_id: number;
    fname: string;
    lname: string;
    birth_year: string;
    gender: string;
    is_active: boolean;
    gross_salary_month: number;
    iban: number;
    bank_id: string;
    name_on_bank_account: string;
    phone_number: number;
    image: string;
    club_id: number;
    club_staff_role_type_id: number;
    user_id: number;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  language: string | null;
  theme: string | null;
}

export function getUserFromLs() {
  const userString = localStorage.getItem(LocalStorageKeys.user);
  if (userString) {
    const { user, token, language, theme } = JSON.parse(userString);
    return { user, token, language, theme };
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
      action: PayloadAction<{
        user: User;
        token: string;
        language: string;
        theme: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.language = action.payload.language;
      state.theme = action.payload.theme;
      localStorage.setItem(
        LocalStorageKeys.user,
        JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
          language: action.payload.language,
          theme: action.payload.theme,
        })
      );
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.language = null;
      localStorage.removeItem(LocalStorageKeys.user);
    },
    updatePlayerDetails: (
      state,
      action: PayloadAction<User["playerDetails"]>
    ) => {
      if (state.user) {
        state.user.playerDetails = {
          ...action.payload,
        };

        localStorage.setItem(
          LocalStorageKeys.user,
          JSON.stringify({
            user: state.user,
            token: state.token,
            language: state.language,
          })
        );
      }
    },
    updateTrainerDetails: (
      state,
      action: PayloadAction<User["trainerDetails"]>
    ) => {
      if (state.user) {
        state.user.trainerDetails = {
          ...action.payload,
        };
        localStorage.setItem(
          LocalStorageKeys.user,
          JSON.stringify({
            user: state.user,
            token: state.token,
            language: state.language,
          })
        );
      }
    },
    updateClubDetails: (state, action: PayloadAction<User["clubDetails"]>) => {
      if (state.user) {
        state.user.clubDetails = {
          ...action.payload,
        };
        localStorage.setItem(
          LocalStorageKeys.user,
          JSON.stringify({
            user: state.user,
            token: state.token,
            language: state.language,
          })
        );
      }
    },
  },
});

export const selectCurrentUser = (state: RootState) => state.user;

export const {
  setCredentials,
  logOut,
  updatePlayerDetails,
  updateTrainerDetails,
  updateClubDetails,
} = authSlice.actions;

export default authSlice.reducer;
