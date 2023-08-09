import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface Trainer {
  trainer_id: number;
  fname: string;
  lname: string;
  birth_year: string;
  gender: string;
  price_hour: number;
  phone_number?: number | null;
  image?: string | null;
  tainer_bio_description?: string | null;
  club_id?: number;
  trainer_experience_type_id: number;
  location_id: number;
  trainer_employment_type_id: number;
  user_id: number;
}

export const trainersSlice = createApi({
  reducerPath: "trainers",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getTrainers: builder.query({
      query: () => "/trainers",
    }),
    addTrainer: builder.mutation({
      query: (trainer) => ({
        url: "/trainers",
        method: "POST",
        body: trainer,
      }),
    }),
    updateTrainer: builder.mutation({
      query: (updates) => ({
        url: "/trainers",
        method: "PUT",
        body: updates,
      }),
    }),
  }),
});

export const {
  useGetTrainersQuery,
  useAddTrainerMutation,
  useUpdateTrainerMutation,
} = trainersSlice;
