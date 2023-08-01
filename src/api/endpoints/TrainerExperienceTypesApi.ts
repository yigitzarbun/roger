import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface TrainerExperienceType {
  trainer_experience_type_id: number;
  trainer_experience_type_name: string;
}

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
