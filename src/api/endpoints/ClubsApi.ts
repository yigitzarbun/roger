import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface Club {
  club_id: number;
  picture?: string | null;
  club_address: string;
  club_bio_description?: string | null;
  club_name: string;
  location_id: number;
  club_type_id: number;
  user_id: number;
  is_trainer_subscription_required: boolean;
  is_player_lesson_subscription_required: boolean;
  is_player_subscription_required: boolean;
  lesson_rule_id?: boolean;
  player_rule_id?: boolean;
  iban?: number;
  bank_id?: number;
  name_on_bank_account?: string;
  higher_price_for_non_subscribers: boolean;
}

export const clubsSlice = createApi({
  reducerPath: "clubs",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getClubs: builder.query({
      query: () => "/clubs",
    }),
    addClub: builder.mutation({
      query: (club) => ({
        url: "/clubs",
        method: "POST",
        body: club,
      }),
    }),
    updateClub: builder.mutation({
      query: (updates) => ({
        url: "/clubs",
        method: "PUT",
        body: updates,
      }),
    }),
  }),
});

export const { useGetClubsQuery, useAddClubMutation, useUpdateClubMutation } =
  clubsSlice;
