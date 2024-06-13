import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface Tournament {
  tournament_id: number;
  registered_at: string;
  is_active: boolean;
  tournament_name: string;
  start_date: string;
  end_date: string;
  application_deadline: string;
  min_birth_year: string;
  max_birth_year: string;
  tournament_gender: string;
  application_fee: number;
  club_subscription_required?: boolean;
  max_players: number;
  club_user_id: number;
}

export const tournamentsSlice = createApi({
  reducerPath: "tournaments",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getTournaments: builder.query({
      query: () => "/tournaments",
    }),
    getTournamentsById: builder.query({
      query: (tournamentId) => `/tournaments/${tournamentId}`,
    }),
    getTournamentByClubUserId: builder.query({
      query: (clubUserId) => `/tournaments/club-tournaments/${clubUserId}`,
    }),
    getTournamentParticipantsCount: builder.query({
      query: (tournamentId) =>
        `/tournaments/tournament-participants-count/${Number(tournamentId)}`,
    }),
    getPaginatedTournaments: builder.query({
      query: (filter) =>
        `/tournaments/paginated?${new URLSearchParams(filter)}`,
    }),
    getTournamentDetails: builder.query({
      query: (filter) =>
        `/tournaments/tournament-details/filter?${new URLSearchParams(filter)}`,
    }),
    addTournament: builder.mutation({
      query: (tournament) => ({
        url: "/tournaments",
        method: "POST",
        body: tournament,
      }),
    }),
    updateTournament: builder.mutation({
      query: (updates) => ({
        url: "/tournaments",
        method: "PUT",
        body: updates,
      }),
    }),
  }),
});

export const {
  useGetTournamentsQuery,
  useGetTournamentsByIdQuery,
  useGetTournamentParticipantsCountQuery,
  useGetTournamentByClubUserIdQuery,
  useGetPaginatedTournamentsQuery,
  useGetTournamentDetailsQuery,
  useAddTournamentMutation,
  useUpdateTournamentMutation,
} = tournamentsSlice;
