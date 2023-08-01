import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface Court {
  court_id: number;
  court_name: string;
  registered_at: string;
  opening_time: string;
  closing_time: string;
  price_hour: string;
  court_structure_type_id: number;
  court_surface_type_id: number;
  club_id: number;
}

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
