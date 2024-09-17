import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../../backend/src/common/constants/apiConstants";

export interface CourtStructureType {
  court_structure_type_id: number;
  court_structure_type_name: string;
}

export const courtStructureTypesSlice = createApi({
  reducerPath: "courtStructureTypes",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getCourtStructureTypes: builder.query({
      query: () => "/court-structure-types",
    }),
  }),
});

export const { useGetCourtStructureTypesQuery } = courtStructureTypesSlice;
