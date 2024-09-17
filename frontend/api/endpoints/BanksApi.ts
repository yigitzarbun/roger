import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../../backend/src/common/constants/apiConstants";

export interface Bank {
  bank_id: number;
  bank_name: string;
}

export const banksSlice = createApi({
  reducerPath: "banks",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getBanks: builder.query({
      query: () => "/banks",
    }),
  }),
});

export const { useGetBanksQuery } = banksSlice;
