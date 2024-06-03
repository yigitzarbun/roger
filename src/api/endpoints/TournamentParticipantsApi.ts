import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface TournamentParticipant {
  tournament_participant_id: number;
  registered_at: string;
  is_active: boolean;
  tournament_id: number;
  player_user_id: number;
  payment_id: number;
}

export const tournamentParticipantsSlice = createApi({
  reducerPath: "tournamentParticipants",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getTournamentParticipants: builder.query({
      query: () => "/tournament-participants",
    }),
    getPaginatedPlayerActiveTournaments: builder.query({
      query: (filter) =>
        `/tournament-participants/paginated?${new URLSearchParams(filter)}`,
    }),
    addTournamentParticipant: builder.mutation({
      query: (participant) => ({
        url: "/tournament-participants",
        method: "POST",
        body: participant,
      }),
    }),
    updateTournamentParticipant: builder.mutation({
      query: (updates) => ({
        url: "/tournament-participants",
        method: "PUT",
        body: updates,
      }),
    }),
  }),
});

export const {
  useGetTournamentParticipantsQuery,
  useGetPaginatedPlayerActiveTournamentsQuery,
  useAddTournamentParticipantMutation,
  useUpdateTournamentParticipantMutation,
} = tournamentParticipantsSlice;
