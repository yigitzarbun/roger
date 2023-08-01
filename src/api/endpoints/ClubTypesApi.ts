import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface ClubType {
  club_type_id: number;
  club_type_name: string;
}

export const clubTypesSlice = createApi({
  reducerPath: "clubTypes",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getClubTypes: builder.query({
      query: () => "/club-types",
    }),
  }),
});

export const { useGetClubTypesQuery } = clubTypesSlice;
