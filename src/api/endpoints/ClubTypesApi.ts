import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

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
