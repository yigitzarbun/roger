import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface Favourite {
  favourite_id: number;
  registered_at: string;
  is_active: boolean;
  favouriter_id: number;
  favouritee_id: number;
}

export const favouritesSlice = createApi({
  reducerPath: "favourites",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getFavourites: builder.query({
      query: () => "/favourites",
    }),
    getFavouritesByFilter: builder.query({
      query: (filter) => `/favourites/filter?${new URLSearchParams(filter)}`,
    }),
    addFavourite: builder.mutation({
      query: (favourite) => ({
        url: "/favourites",
        method: "POST",
        body: favourite,
      }),
    }),
    updateFavourite: builder.mutation({
      query: (updates) => ({
        url: "/favourites",
        method: "PUT",
        body: updates,
      }),
    }),
  }),
});

export const {
  useGetFavouritesQuery,
  useGetFavouritesByFilterQuery,
  useAddFavouriteMutation,
  useUpdateFavouriteMutation,
} = favouritesSlice;
