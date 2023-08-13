import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface ClubSubscriptionTypes {
  club_subscription_type_id: number;
  club_subscription_type_name: string;
  club_subscription_duration_months: number;
}

export const clubSubscriptionTypesSlice = createApi({
  reducerPath: "clubSubscriptionTypes",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getClubSubscriptionTypes: builder.query({
      query: () => "/club-subscription-types",
    }),
  }),
});

export const { useGetClubSubscriptionTypesQuery } = clubSubscriptionTypesSlice;
