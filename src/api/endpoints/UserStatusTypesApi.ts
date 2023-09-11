import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface UserType {
  user_type_id: number;
  user_type_name: string;
}

export const userStatusTypesSlice = createApi({
  reducerPath: "userStatusTypes",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getUserStatusTypes: builder.query({
      query: () => "/user-status-types",
    }),
  }),
});

export const { useGetUserStatusTypesQuery } = userStatusTypesSlice;
