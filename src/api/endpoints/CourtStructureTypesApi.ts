import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

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
