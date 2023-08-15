import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export const clubStaffRoleTypesSlice = createApi({
  reducerPath: "clubStaffRoleTypes",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getClubStaffRoleTypes: builder.query({
      query: () => "/club-staff-role-types",
    }),
  }),
});

export const { useGetClubStaffRoleTypesQuery } = clubStaffRoleTypesSlice;
