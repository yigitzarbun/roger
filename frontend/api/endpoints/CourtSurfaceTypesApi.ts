import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../../backend/src/common/constants/apiConstants";

export interface CourtSurfaceType {
  court_surface_type_id: number;
  court_surface_type_name: string;
}

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
