import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export const playerLevelsSlice = createApi({
  reducerPath: "playerLevels",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getPlayerLevels: builder.query({
      query: () => "/player-levels",
    }),
  }),
});

export const { useGetPlayerLevelsQuery } = playerLevelsSlice;
