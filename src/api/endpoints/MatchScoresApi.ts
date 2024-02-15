import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface MatchScore {
  match_score_id: number;
  match_score_status_type_id: number;
  inviter_first_set_games_won?: number;
  inviter_second_set_games_won?: number;
  inviter_third_set_games_won?: number;
  invitee_first_set_games_won?: number;
  invitee_second_set_games_won?: number;
  invitee_third_set_games_won?: number;
  booking_id: number;
  winner_id?: number;
  reporter_id?: number;
}

export const matchScoresSlice = createApi({
  reducerPath: "matchScores",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getMatchScores: builder.query({
      query: () => "/match-scores",
    }),
    getMatchScoreById: builder.query({
      query: (match_score_id) => `/match-scores/${match_score_id}`,
    }),
    getPlayerMatchScoresWithBookingDetails: builder.query({
      query: (filter) =>
        `/match-scores/match-scores-booking-details/filter?${new URLSearchParams(
          filter
        )}`,
    }),
    getMissingMatchScoresNumber: builder.query({
      query: (userId) => `/match-scores/missing-match-scores/${userId}`,
    }),
    addMatchScore: builder.mutation({
      query: (matchScore) => ({
        url: "/match-scores",
        method: "POST",
        body: matchScore,
      }),
    }),
    updateMatchScore: builder.mutation({
      query: (updatedMatchScore) => ({
        url: `/match-scores`,
        method: "PUT",
        body: updatedMatchScore,
      }),
    }),
  }),
});

export const {
  useGetMatchScoresQuery,
  useGetMatchScoreByIdQuery,
  useGetPlayerMatchScoresWithBookingDetailsQuery,
  useGetMissingMatchScoresNumberQuery,
  useAddMatchScoreMutation,
  useUpdateMatchScoreMutation,
} = matchScoresSlice;
