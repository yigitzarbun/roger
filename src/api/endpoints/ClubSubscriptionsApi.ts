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
  payment_id: number;
}

export const clubSubscriptionsSlice = createApi({
  reducerPath: "clubSubscriptions",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getClubSubscriptions: builder.query({
      query: () => "/club-subscriptions",
    }),
    getClubSubscriptionsByFilter: builder.query({
      query: (filter) =>
        `/club-subscriptions/filter?${new URLSearchParams(filter)}`,
    }),
    getPlayersTraininSubscriptionStatus: builder.query({
      query: (filter) =>
        `/club-subscriptions/players-training-subscription-status/filter?${new URLSearchParams(
          filter
        )}`,
    }),
    getPlayerActiveClubSubscriptions: builder.query({
      query: (userId) =>
        `/club-subscriptions/player-active-club-subscriptions/${userId}`,
    }),
    getClubSubscriptionsById: builder.query({
      query: (club_subscription_id) =>
        `/club-subscriptions/${club_subscription_id}`,
    }),
    getClubSubscribersById: builder.query({
      query: (userId) => `/club-subscriptions/club-subscribers/${userId}`,
    }),
    addClubSubscription: builder.mutation({
      query: (subscription) => ({
        url: "/club-subscriptions",
        method: "POST",
        body: subscription,
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
  useGetClubSubscriptionsByFilterQuery,
  useGetPlayersTraininSubscriptionStatusQuery,
  useGetPlayerActiveClubSubscriptionsQuery,
  useGetClubSubscriptionsByIdQuery,
  useGetClubSubscribersByIdQuery,
  useAddClubSubscriptionMutation,
  useUpdateClubSubscriptionMutation,
} = clubSubscriptionsSlice;
