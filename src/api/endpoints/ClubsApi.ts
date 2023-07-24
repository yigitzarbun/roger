import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export const clubsSlice = createApi({
  reducerPath: "clubs",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getClubs: builder.query({
      query: () => "/clubs",
    }),
    addClub: builder.mutation({
      query: (club) => ({
        url: "/clubs",
        method: "POST",
        body: club,
      }),
    }),
  }),
});

export const { useGetClubsQuery, useAddClubMutation } = clubsSlice;
