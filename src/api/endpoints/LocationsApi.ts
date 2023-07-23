import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

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
