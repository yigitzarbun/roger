import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../src/common/constants/apiConstants";

export interface TournamentMatchRounds {
  tournament_match_round_id: number;
  tournament_match_round_name: string;
}

export const tournamentMatchRoundsSlice = createApi({
  reducerPath: "tournamentMatchRounds",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getTournamentMatchRounds: builder.query({
      query: () => "/tournament-match-rounds",
    }),
  }),
});

export const { useGetTournamentMatchRoundsQuery } = tournamentMatchRoundsSlice;
