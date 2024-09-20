import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../src/common/constants/apiConstants";

export interface ClubExternalMember {
  club_external_member_id: number;
  member_id?: string;
  email?: string;
  fname: string;
  lname: string;
  birth_year?: string;
  gender?: string;
  is_active: boolean;
  club_id: number;
  player_level_id: number;
  location_id: number;
  user_id: number;
}

export const clubExternalMembersSlice = createApi({
  reducerPath: "clubExternalMembers",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getClubExternalMembers: builder.query({
      query: () => "/club-external-members",
    }),
    getClubExternalMembersByFilter: builder.query({
      query: (filter) =>
        `/club-external-members/filter?${new URLSearchParams(filter)}`,
    }),
    addClubExternalMember: builder.mutation({
      query: (member) => ({
        url: "/club-external-members",
        method: "POST",
        body: member,
      }),
    }),
    updateClubExternalMember: builder.mutation({
      query: (updatedMember) => ({
        url: `/club-external-members`,
        method: "PUT",
        body: updatedMember,
      }),
    }),
  }),
});

export const {
  useGetClubExternalMembersQuery,
  useGetClubExternalMembersByFilterQuery,
  useAddClubExternalMemberMutation,
  useUpdateClubExternalMemberMutation,
} = clubExternalMembersSlice;
