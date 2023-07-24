import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export const playersSlice = createApi({
  reducerPath: "players",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getPlayers: builder.query({
      query: () => "/players",
    }),
    addPlayer: builder.mutation({
      query: (player) => ({
        url: "/players",
        method: "POST",
        body: player,
      }),
    }),
  }),
});

export const { useGetPlayersQuery, useAddPlayerMutation } = playersSlice;
