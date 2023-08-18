import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface ClubSubscription {
  club_subscription_id: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  club_id: number;
  player_id: number;
  club_subscription_package_id: number;
}

export const clubSubscriptionsSlice = createApi({
  reducerPath: "clubSubscriptions",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getClubSubscriptions: builder.query({
      query: () => "/club-subscriptions",
    }),
    addClubSubscription: builder.mutation({
      query: (club) => ({
        url: "/club-subscriptions",
        method: "POST",
        body: club,
      }),
    }),
    updateClubSubscription: builder.mutation({
      query: (updates) => ({
        url: "/club-subscriptions",
        method: "PUT",
        body: updates,
      }),
    }),
  }),
});

export const {
  useGetClubSubscriptionsQuery,
  useAddClubSubscriptionMutation,
  useUpdateClubSubscriptionMutation,
} = clubSubscriptionsSlice;
