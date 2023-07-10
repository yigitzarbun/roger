import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    getPlayers: builder.query({
      query: () => "/players",
    }),
    addPlayer: builder.mutation({
      query: (player) => ({
        url: "/playersAuth/register",
        method: "POST",
        body: player,
      }),
    }),
  }),
});

export const { useGetPlayersQuery, useAddPlayerMutation } = apiSlice;
