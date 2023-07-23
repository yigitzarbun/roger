import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export const userTypesSlice = createApi({
  reducerPath: "userTypes",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getUserTypes: builder.query({
      query: () => "/user-types",
    }),
  }),
});

export const { useGetUserTypesQuery } = userTypesSlice;
