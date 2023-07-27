import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export const courtsSlice = createApi({
  reducerPath: "courts",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getCourts: builder.query({
      query: () => "/courts",
    }),
    addCourt: builder.mutation({
      query: (court) => ({
        url: "/courts",
        method: "POST",
        body: court,
      }),
    }),
  }),
});

export const { useGetCourtsQuery, useAddCourtMutation } = courtsSlice;
