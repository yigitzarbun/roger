import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export const courtSurfaceTypesSlice = createApi({
  reducerPath: "courtSurfaceTypes",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getCourtSurfaceTypes: builder.query({
      query: () => "/court-surface-types",
    }),
  }),
});

export const { useGetCourtSurfaceTypesQuery } = courtSurfaceTypesSlice;
