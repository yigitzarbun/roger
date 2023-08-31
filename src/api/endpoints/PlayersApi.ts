import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

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
  card_number?: number;
  cvc?: number;
  card_expiry?: string;
  image?: string;
}

export const playersSlice = createApi({
  reducerPath: "players",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getPlayers: builder.query({
      query: () => "/players",
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
      query: (updatedPlayer) => ({
        url: "/players",
        method: "PUT",
        body: updatedPlayer,
      }),
    }),
  }),
});

export const {
  useGetPlayersQuery,
  useAddPlayerMutation,
  useUpdatePlayerMutation,
} = playersSlice;
