import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store/store";

interface Court {}

const initialState = {
  courts: [],
};

const courtsSlice = createSlice({
  name: "courts",
  initialState,
  reducers: {
    addCourt: (state, action: PayloadAction<{ court: Court }>) => {
      state.courts = [...state.courts, action.payload];
    },
    getCourts: (state, action: PayloadAction<{ courts: Court[] | [] }>) => {
      state.courts = action.payload;
    },
  },
});

export const selectCourts = (state: RootState) => state.courts;

export const { getCourts } = courtsSlice.actions;

export default courtsSlice.reducer;
