import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface EventReview {
  event_review_id: number;
  event_review_title: string;
  event_review_description: string;
  review_score: number;
  is_active: boolean;
  booking_id: number;
  reviewer_id: number;
}

export const eventReviewsSlice = createApi({
  reducerPath: "eventReviews",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getEventReviews: builder.query({
      query: () => "/event-reviews",
    }),
    getEventReviewsByFilter: builder.query({
      query: (filter) => `/event-reviews/filter?${new URLSearchParams(filter)}`,
    }),
    getReviewDetailsByFilter: builder.query({
      query: (filter) =>
        `/event-reviews/review-details/filter?${new URLSearchParams(filter)}`,
    }),
    getPlayerMissingEventReviewsNumber: builder.query({
      query: (userId) => `/event-reviews/player-missing-reviews/${userId}`,
    }),
    getUserReceivedEventReviewsNumber: builder.query({
      query: (userId) => `/event-reviews/user-received-reviews/${userId}`,
    }),
    addEventReview: builder.mutation({
      query: (review) => ({
        url: "/event-reviews",
        method: "POST",
        body: review,
      }),
    }),
    updateEventReview: builder.mutation({
      query: (updates) => ({
        url: `/event-reviews`,
        method: "PUT",
        body: updates,
      }),
    }),
  }),
});

export const {
  useGetEventReviewsQuery,
  useGetEventReviewsByFilterQuery,
  useGetReviewDetailsByFilterQuery,
  useGetUserReceivedEventReviewsNumberQuery,
  useGetPlayerMissingEventReviewsNumberQuery,
  useAddEventReviewMutation,
  useUpdateEventReviewMutation,
} = eventReviewsSlice;
