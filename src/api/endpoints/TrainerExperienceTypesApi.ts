import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export const trainerExperienceTypesSlice = createApi({
  reducerPath: "trainerExperienceTypes",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getTrainerExperienceTypes: builder.query({
      query: () => "/trainer-experience-types",
    }),
  }),
});

export const { useGetTrainerExperienceTypesQuery } =
  trainerExperienceTypesSlice;
