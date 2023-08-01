import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface Club {
  club_id: number;
  picture?: string | null;
  club_address: string;
  club_bio_description?: string | null;
  club_name: string;
  location_id: number;
  club_type_id: number;
  user_id: number;
}

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
