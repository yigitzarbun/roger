import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface Club {
  club_id: number;
  club_address: string;
  club_bio_description?: string | null;
  club_name: string;
  location_id: number;
  club_type_id: number;
  user_id: number;
  is_trainer_subscription_required: boolean;
  is_player_lesson_subscription_required: boolean;
  is_player_subscription_required: boolean;
  lesson_rule_id?: boolean;
  player_rule_id?: boolean;
  iban?: number;
  bank_id?: number;
  name_on_bank_account?: string;
  higher_price_for_non_subscribers: boolean;
  image?: string;
}

export const clubsSlice = createApi({
  reducerPath: "clubs",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getClubs: builder.query({
      query: () => "/clubs",
    }),
    getClubByClubId: builder.query({
      query: (club_id) => `/clubs/${club_id}`,
    }),
    addClub: builder.mutation({
      query: (club) => {
        const formData = new FormData();
        formData.append("club_name", club.club_name);
        formData.append("location_id", club.location_id);
        formData.append("club_type_id", club.club_type_id);
        formData.append("user_id", club.user_id);
        if (club.image) {
          formData.append("image", club.image);
        }
        if (club.club_address) {
          formData.append("club_address", club.club_address);
        }
        if (club.club_bio_description) {
          formData.append("club_bio_description", club.club_bio_description);
        }
        if (club.phone_number) {
          formData.append("phone_number", club.phone_number);
        }

        const requestObject = {
          url: "/clubs",
          method: "POST",
          body: formData,
        };

        return requestObject;
      },
    }),
    updateClub: builder.mutation({
      query: (club) => {
        const formData = new FormData();
        formData.append("club_id", club.club_id);
        formData.append("club_name", club.club_name);
        formData.append("location_id", club.location_id);
        formData.append("club_type_id", club.club_type_id);
        formData.append("user_id", club.user_id);

        if (club.image) {
          formData.append("image", club.image);
        }
        if (club.club_address) {
          formData.append("club_address", club.club_address);
        }
        if (club.club_bio_description) {
          formData.append("club_bio_description", club.club_bio_description);
        }
        if (club.phone_number) {
          formData.append("phone_number", club.phone_number.toString());
        }
        if (club.is_trainer_subscription_required) {
          formData.append(
            "is_trainer_subscription_required",
            club.is_trainer_subscription_required
          );
        }
        if (club.is_player_lesson_subscription_required) {
          formData.append(
            "is_player_lesson_subscription_required",
            club.is_player_lesson_subscription_required
          );
        }
        if (club.is_player_subscription_required) {
          formData.append(
            "is_player_subscription_required",
            club.is_player_subscription_required
          );
        }
        if (club.iban) {
          formData.append("iban", club.iban.toString());
        }
        if (club.bank_id) {
          formData.append("bank_id", club.bank_id.toString());
        }
        if (club.name_on_bank_account) {
          formData.append("name_on_bank_account", club.name_on_bank_account);
        }
        if (club.higher_price_for_non_subscribers) {
          formData.append(
            "higher_price_for_non_subscribers",
            club.higher_price_for_non_subscribers
          );
        }
        const requestObject = {
          url: "/clubs",
          method: "PUT",
          body: formData,
        };

        return requestObject;
      },
    }),
  }),
});

export const {
  useGetClubsQuery,
  useGetClubByClubIdQuery,
  useAddClubMutation,
  useUpdateClubMutation,
} = clubsSlice;
