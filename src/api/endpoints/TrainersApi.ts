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
  trainer_bio_description?: string | null;
  club_id?: number;
  trainer_experience_type_id: number;
  location_id: number;
  trainer_employment_type_id: number;
  user_id: number;
  iban?: number;
  name_on_bank_account?: string;
  bank_id?: number;
}

export const trainersSlice = createApi({
  reducerPath: "trainers",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getTrainers: builder.query({
      query: () => "/trainers",
    }),
    addTrainer: builder.mutation({
      query: (trainer) => {
        const formData = new FormData();
        formData.append("fname", trainer.fname);
        formData.append("lname", trainer.lname);
        formData.append("birth_year", trainer.birth_year.toString());
        formData.append("gender", trainer.gender);
        formData.append("price_hour", trainer.price_hour.toString());
        formData.append("location_id", trainer.location_id.toString());
        formData.append(
          "trainer_experience_type_id",
          trainer.trainer_experience_type_id.toString()
        );
        formData.append(
          "trainer_employment_type_id",
          trainer.trainer_employment_type_id.toString()
        );
        formData.append("user_id", trainer.user_id.toString());
        if (trainer.club) {
          formData.append("club_id", trainer.club_id.toString());
        }
        if (trainer.image) {
          formData.append("image", trainer.image);
        }
        if (trainer.phone_number) {
          formData.append("phone_number", trainer.phone_number);
        }
        if (trainer.trainer_bio_description) {
          formData.append(
            "trainer_bio_description",
            trainer.trainer_bio_description
          );
        }
        const requestObject = {
          url: "/trainers",
          method: "POST",
          body: formData,
        };

        return requestObject;
      },
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
