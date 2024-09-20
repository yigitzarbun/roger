import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../src/common/constants/apiConstants";

export interface Player {
  player_id: number;
  fname: string;
  lname: string;
  player_level_id: number;
  gender: string;
  birth_year: string;
  location_id: number;
  user_id: number;
  name_on_card?: string;
  card_number?: string;
  cvc?: number;
  card_expiry?: string;
  image?: string;
}
export interface PaginatedPlayers {
  players: Player[];
  totalPages: number;
}
export const playersSlice = createApi({
  reducerPath: "players",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getPlayers: builder.query({
      query: () => "/players",
    }),
    getPaginatedPlayers: builder.query({
      query: (filter) =>
        `/players/paginated?currentPage=${filter.currentPage}&playerLevelId=${filter.playerLevelId}&selectedGender=${filter.selectedGender}&locationId=${filter.locationId}&currentUserId=${filter.currentUserId}&textSearch=${filter.textSearch}&minAgeYear=${filter.minAgeYear}&maxAgeYear=${filter.maxAgeYear}&proximityLocationId=${filter.proximityLocationId}&logicLevelId=${filter.logicLevelId}&column=${filter.column}&direction=${filter.direction}`,
    }),
    getPlayerByPlayerId: builder.query({
      query: (player_id) => `/players/player/${player_id}`,
    }),
    getPlayerByUserId: builder.query({
      query: (user_id) => `/players/user/${user_id}`,
    }),
    getPlayerPaymentDetailsExist: builder.query({
      query: (user_id) => `/players/player-payment-details-exist/${user_id}`,
    }),
    getPlayerProfileDetails: builder.query({
      query: (user_id) => `/players/player-profile-details/${user_id}`,
    }),
    getPlayersByFilter: builder.query({
      query: (filter) => `/players/filter?${new URLSearchParams(filter)}`,
    }),
    addPlayer: builder.mutation({
      query: (player) => {
        const formData = new FormData();
        formData.append("fname", player.fname);
        formData.append("lname", player.lname);
        formData.append("birth_year", player.birth_year.toString());
        formData.append("gender", player.gender);
        formData.append("location_id", player.location_id.toString());
        formData.append("player_level_id", player.player_level_id.toString());
        formData.append("user_id", player.user_id.toString());
        if (player.image) {
          formData.append("image", player.image);
        }
        if (player.phone_number) {
          formData.append("phone_number", player.phone_number);
        }
        if (player.player_bio_description) {
          formData.append(
            "player_bio_description",
            player.player_bio_description
          );
        }
        const requestObject = {
          url: "/players",
          method: "POST",
          body: formData,
        };

        return requestObject;
      },
    }),
    updatePlayer: builder.mutation({
      query: (player) => {
        const formData = new FormData();
        formData.append("player_id", player.player_id);
        formData.append("fname", player.fname);
        formData.append("lname", player.lname);
        formData.append("birth_year", player.birth_year.toString());
        formData.append("gender", player.gender);
        formData.append("location_id", player.location_id.toString());
        formData.append("player_level_id", player.player_level_id.toString());
        formData.append("user_id", player.user_id.toString());
        if (player.image) {
          formData.append("image", player.image);
        }
        if (player.phone_number) {
          formData.append("phone_number", player.phone_number);
        }
        if (player.player_bio_description) {
          formData.append(
            "player_bio_description",
            player.player_bio_description
          );
        }
        if (player.name_on_card) {
          formData.append("name_on_card", player.name_on_card);
        }
        if (player.card_number) {
          formData.append("card_number", player.card_number);
        }
        if (player.cvc) {
          formData.append("cvc", player.cvc);
        }
        if (player.card_expiry) {
          formData.append("card_expiry", player.card_expiry);
        }
        const requestObject = {
          url: "/players",
          method: "PUT",
          body: formData,
        };

        return requestObject;
      },
    }),
  }),
});

export const {
  useGetPlayersQuery,
  useGetPaginatedPlayersQuery,
  useGetPlayerByPlayerIdQuery,
  useGetPlayerByUserIdQuery,
  useGetPlayerProfileDetailsQuery,
  useGetPlayerPaymentDetailsExistQuery,
  useGetPlayersByFilterQuery,
  useAddPlayerMutation,
  useUpdatePlayerMutation,
} = playersSlice;
