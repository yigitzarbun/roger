import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

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
    updatebooking: builder.mutation({
      query: (updatedBooking) => ({
        url: `/bookings/${updatedBooking.booking_id}`,
        method: "PUT",
        body: updatedBooking,
      }),
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useAddBookingMutation,
  useUpdatebookingMutation,
} = bookingsSlice;
