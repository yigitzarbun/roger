import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export const eventTypesSlice = createApi({
  reducerPath: "eventTypes",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getEventTypes: builder.query({
      query: () => "/event-types",
    }),
  }),
});

export const { useGetEventTypesQuery } = eventTypesSlice;
