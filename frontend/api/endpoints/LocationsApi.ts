import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../../backend/src/common/constants/apiConstants";

export interface Location {
  location_id: number;
  location_name: string;
}

export const locationsSlice = createApi({
  reducerPath: "locations",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getLocations: builder.query({
      query: () => "/locations",
    }),
  }),
});

export const { useGetLocationsQuery } = locationsSlice;
