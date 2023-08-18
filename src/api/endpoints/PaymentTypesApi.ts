import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface PaymentType {
  payment_type_id: number;
  payment_type_name: string;
}

export const paymentTypesSlice = createApi({
  reducerPath: "paymentTypes",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getPaymentTypes: builder.query({
      query: () => "/payment-types",
    }),
  }),
});

export const { useGetPaymentTypesQuery } = paymentTypesSlice;
