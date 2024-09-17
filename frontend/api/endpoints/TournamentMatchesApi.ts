import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../../backend/src/common/constants/apiConstants";

export const tournamentMatchesSlice = createApi({
  reducerPath: "tournamentMatches",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getTournamentMatches: builder.query({
      query: () => "/tournament-matches",
    }),
    getTournamentMatchById: builder.query({
      query: (tournamentMatchId) => `/tournament-matches/${tournamentMatchId}`,
    }),
    getTournamentMatchesByTournamentId: builder.query({
      query: (filter) =>
        `/tournament-matches/tournament-matches-by-tournament-id?${new URLSearchParams(
          filter
        )}`,
    }),
    addTournamentMatch: builder.mutation({
      query: (tournamentMatch) => ({
        url: "/tournament-matches",
        method: "POST",
        body: tournamentMatch,
      }),
    }),
    updateTournamentMatch: builder.mutation({
      query: (updates) => ({
        url: "/tournament-matches",
        method: "PUT",
        body: updates,
      }),
    }),
  }),
});

export const {
  useGetTournamentMatchesQuery,
  useGetTournamentMatchByIdQuery,
  useGetTournamentMatchesByTournamentIdQuery,
  useAddTournamentMatchMutation,
  useUpdateTournamentMatchMutation,
} = tournamentMatchesSlice;
