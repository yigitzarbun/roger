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
  useAddBookingMutation,
  useUpdateBookingMutation,
} = bookingsSlice;
