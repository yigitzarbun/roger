import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

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
  }),
});

export const { useGetTrainersQuery, useAddTrainerMutation } = trainersSlice;
