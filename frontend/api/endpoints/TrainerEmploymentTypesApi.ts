import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../../backend/src/common/constants/apiConstants";

export const trainerEmploymentTypesSlice = createApi({
  reducerPath: "trainerEmploymentTypes",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getTrainerEmploymentTypes: builder.query({
      query: () => "/trainer-employment-types",
    }),
  }),
});

export const { useGetTrainerEmploymentTypesQuery } =
  trainerEmploymentTypesSlice;
