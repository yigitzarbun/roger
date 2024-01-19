import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface Booking {
  booking_id: number;
  event_date: string;
  event_time: string;
  court_price: number;
  lesson_price?: number;
  payment_id?: number;
  booking_status_type_id: number;
  event_type_id: number;
  club_id: number;
  court_id: number;
  inviter_id: number;
  invitee_id: number;
  invitation_note?: string;
}

export const bookingsSlice = createApi({
  reducerPath: "bookings",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: () => "/bookings",
    }),
    getBookingById: builder.query({
      query: (booking_id) => `/bookings/${booking_id}`,
    }),
    getPlayerBookingsByUserId: builder.query({
      query: (userId) => `/bookings/player-bookings/${userId}`,
    }),
    getPlayerOutgoingRequests: builder.query({
      query: (userId) => `/bookings/outgoing-requests/${userId}`,
    }),
    getPlayerIncomingRequests: builder.query({
      query: (userId) => `/bookings/incoming-requests/${userId}`,
    }),
    getPlayerPastEvents: builder.query({
      query: (userId) => `/bookings/past-events/${userId}`,
    }),
    getPlayersLeaderboard: builder.query({
      query: (filter) =>
        `/bookings/players-leaderboard/filter?${new URLSearchParams(filter)}`,
    }),
    getBookedCourtHours: builder.query({
      query: (filter) =>
        `/bookings/get-booked-hours/filter?${new URLSearchParams(filter)}`,
    }),
    getBookingsByFilter: builder.query({
      query: (filter) => `/bookings/filter?${new URLSearchParams(filter)}`,
    }),
    addBooking: builder.mutation({
      query: (booking) => ({
        url: "/bookings",
        method: "POST",
        body: booking,
      }),
    }),
    updateBooking: builder.mutation({
      query: (updatedBooking) => ({
        url: `/bookings/`,
        method: "PUT",
        body: updatedBooking,
      }),
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useGetPlayerBookingsByUserIdQuery,
  useGetPlayerOutgoingRequestsQuery,
  useGetPlayerIncomingRequestsQuery,
  useGetPlayerPastEventsQuery,
  useGetPlayersLeaderboardQuery,
  useGetBookingsByFilterQuery,
  useGetBookedCourtHoursQuery,
  useAddBookingMutation,
  useUpdateBookingMutation,
} = bookingsSlice;
