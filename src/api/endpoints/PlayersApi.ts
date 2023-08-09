import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface Player {
  player_id: number;
  image?: string;
  fname: string;
  lname: string;
  player_level_id: number;
  gender: string;
  birth_year: string;
  location_id: number;
  user_id: number;
}

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
    updatePlayer: builder.mutation({
      query: (updatedPlayer) => ({
        url: "/players",
        method: "PUT",
        body: updatedPlayer,
      }),
    }),
  }),
});

export const {
  useGetPlayersQuery,
  useAddPlayerMutation,
  useUpdatePlayerMutation,
} = playersSlice;
