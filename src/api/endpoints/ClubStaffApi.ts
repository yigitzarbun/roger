import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface ClubStaff {
  club_staff_id: number;
  fname: string;
  lname: string;
  birth_year: string;
  gender: string;
  employment_status: string;
  gross_salary_month?: number | null;
  iban?: number | null;
  bank_id?: string | null;
  name_on_bank_account?: string | null;
  phone_number?: number | null;
  image?: string | null;
  club_id: number;
  club_staff_role_type_id: number;
  user_id: number;
}

export const clubStaffSlice = createApi({
  reducerPath: "clubStaff",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getClubStaff: builder.query({
      query: () => "/club-staff",
    }),
    getPaginatedClubStaff: builder.query({
      query: (filter) =>
        `/club-staff/paginated?currentPage=${filter.currentPage}&locationId=${filter.locationId}&gender=${filter.gender}&roleId=${filter.roleId}&textSearch=${filter.textSearch}&clubId=${filter.clubId}`,
    }),
    getClubStaffByFilter: builder.query({
      query: (filter) => `/club-staff/filter?${new URLSearchParams(filter)}`,
    }),
    getClubTrainers: builder.query({
      query: (userId) => `/club-staff/club-trainers/${userId}`,
    }),
    getClubNewStaffRequests: builder.query({
      query: (clubId) => `/club-staff/club-new-staff-requests/${clubId}`,
    }),
    addClubStaff: builder.mutation({
      query: (clubStaff) => ({
        url: "/club-staff",
        method: "POST",
        body: clubStaff,
      }),
    }),
    updateClubStaff: builder.mutation({
      query: (updates) => ({
        url: "/club-staff",
        method: "PUT",
        body: updates,
      }),
    }),
  }),
});

export const {
  useGetClubStaffQuery,
  useGetClubStaffByFilterQuery,
  useGetPaginatedClubStaffQuery,
  useGetClubTrainersQuery,
  useGetClubNewStaffRequestsQuery,
  useAddClubStaffMutation,
  useUpdateClubStaffMutation,
} = clubStaffSlice;
