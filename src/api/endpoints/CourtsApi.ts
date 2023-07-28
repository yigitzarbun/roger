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
    updateCourt: builder.mutation({
      query: (updatedCourt) => ({
        url: `/courts/${updatedCourt.court_id}`,
        method: "PUT",
        body: updatedCourt,
      }),
    }),
  }),
});

export const {
  useGetCourtsQuery,
  useAddCourtMutation,
  useUpdateCourtMutation,
} = courtsSlice;
