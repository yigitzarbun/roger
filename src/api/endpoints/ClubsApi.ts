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

export interface PaginatedClubs {
  clubs: Club[];
  totalPages: number;
}
export const clubsSlice = createApi({
  reducerPath: "clubs",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getClubs: builder.query({
      query: () => "/clubs",
    }),
    getPaginatedClubs: builder.query({
      query: (filter) =>
        `clubs/paginated?page=${filter.page}&locationId=${filter.locationId}&textSearch=${filter.textSearch}&clubType=${filter.clubType}&courtSurfaceType=${filter.courtSurfaceType}&courtStructureType=${filter.courtStructureType}&clubTrainers=${filter.clubTrainers}&subscribedClubs=${filter.subscribedClubs}&currentUserId=${filter.currentUserId}`,
    }),
    getClubByClubId: builder.query({
      query: (club_id) => `/clubs/club/${club_id}`,
    }),
    getClubByUserId: builder.query({
      query: (user_id) => `/clubs/user/${user_id}`,
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

        if (club.club_id) {
          formData.append("club_id", club.club_id);
        }
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
        if (
          club.is_trainer_subscription_required === true ||
          club.is_trainer_subscription_required === false
        ) {
          formData.append(
            "is_trainer_subscription_required",
            club.is_trainer_subscription_required
          );
        }
        if (
          club.is_player_lesson_subscription_required === true ||
          club.is_player_lesson_subscription_required === false
        ) {
          formData.append(
            "is_player_lesson_subscription_required",
            club.is_player_lesson_subscription_required
          );
        }
        if (
          club.is_player_subscription_required === true ||
          club.is_player_subscription_required === false
        ) {
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
        if (
          club.higher_price_for_non_subscribers === true ||
          club.higher_price_for_non_subscribers === false
        ) {
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
  useGetPaginatedClubsQuery,
  useGetClubByClubIdQuery,
  useGetClubByUserIdQuery,
  useAddClubMutation,
  useUpdateClubMutation,
} = clubsSlice;
