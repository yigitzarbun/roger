import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface Payment {
  payment_id: number;
  payment_amount: number;
  registered_at: string;
  payment_status: string;
  payment_type_id: number;
  sender_subscriber_id?: number | null;
  sender_inviter_id?: number | null;
  sender_invitee_id?: number | null;
  recipient_club_id?: number | null;
  recipient_trainer_id?: number | null;
  booking_id?: number | null;
  club_subscription_id?: number | null;
}

export const paymentsSlice = createApi({
  reducerPath: "payments",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: () => "/payments",
    }),
    addPayment: builder.mutation({
      query: (payment) => ({
        url: "/payments",
        method: "POST",
        body: payment,
      }),
    }),
    updatePayment: builder.mutation({
      query: (updatedPayment) => ({
        url: "/payments",
        method: "PUT",
        body: updatedPayment,
      }),
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useAddPaymentMutation,
  useUpdatePaymentMutation,
} = paymentsSlice;
