import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface ClubSubscriptionPackage {
  club_subscription_package_id: number;
  price: number;
  registered_at: string;
  club_subscription_type_id: number;
  club_id: number;
  is_active: boolean;
}

export const clubSubscriptionPackagesSlice = createApi({
  reducerPath: "clubSubscriptionPackages",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getClubSubscriptionPackages: builder.query({
      query: () => "/club-subscription-packages",
    }),
    getClubSubscriptionPackagesByFilter: builder.query({
      query: (filter) =>
        `/club-subscription-packages/filter?${new URLSearchParams(filter)}`,
    }),
    addClubSubscriptionPackage: builder.mutation({
      query: (club) => ({
        url: "/club-subscription-packages",
        method: "POST",
        body: club,
      }),
    }),
    updateClubSubscriptionPackage: builder.mutation({
      query: (updates) => ({
        url: "/club-subscription-packages",
        method: "PUT",
        body: updates,
      }),
    }),
  }),
});

export const {
  useGetClubSubscriptionPackagesQuery,
  useGetClubSubscriptionPackagesByFilterQuery,
  useAddClubSubscriptionPackageMutation,
  useUpdateClubSubscriptionPackageMutation,
} = clubSubscriptionPackagesSlice;
