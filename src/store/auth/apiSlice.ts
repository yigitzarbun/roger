import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: "/usersAuth/register",
        method: "POST",
        body: user,
      }),
    }),
    loginUser: builder.mutation({
      query: (user) => ({
        url: "/usersAuth/login",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const { useGetUsersQuery, useAddUserMutation, useLoginUserMutation } =
  apiSlice;
