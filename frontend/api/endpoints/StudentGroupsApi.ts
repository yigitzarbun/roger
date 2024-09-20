import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../src/common/constants/apiConstants";

export interface StudentGroup {
  student_group_id: number;
  registered_at: string;
  student_group_name: string;
  is_active: boolean;
  club_id?: number;
  trainer_id?: number;
  first_student_id: number;
  second_student_id: number;
  third_student_id: number;
  fourth_student_id: number;
  user_id: number;
}

export const studentGroupsSlice = createApi({
  reducerPath: "studentGroups",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getStudentGroups: builder.query({
      query: () => "/student-groups",
    }),
    getStudentGroupsByFilter: builder.query({
      query: (filter) =>
        `/student-groups/filter?${new URLSearchParams(filter)}`,
    }),
    getPaginatedStudentGroups: builder.query({
      query: (filter) =>
        `/student-groups/paginated-student-groups/filter?${new URLSearchParams(
          filter
        )}`,
    }),
    getPaginatedTrainerStudentGroups: builder.query({
      query: (filter) =>
        `/student-groups/paginated-trainer-student-groups/filter?${new URLSearchParams(
          filter
        )}`,
    }),
    getPlayerActiveStudentGroupsByUserId: builder.query({
      query: (userId) =>
        `/student-groups/player-active-student-groups/${userId}`,
    }),
    addStudentGroup: builder.mutation({
      query: (studentGroup) => ({
        url: "/student-groups",
        method: "POST",
        body: studentGroup,
      }),
    }),
    updateStudentGroup: builder.mutation({
      query: (updatedStudentGroup) => ({
        url: "/student-groups",
        method: "PUT",
        body: updatedStudentGroup,
      }),
    }),
  }),
});

export const {
  useGetStudentGroupsQuery,
  useGetStudentGroupsByFilterQuery,
  useGetPlayerActiveStudentGroupsByUserIdQuery,
  useGetPaginatedStudentGroupsQuery,
  useGetPaginatedTrainerStudentGroupsQuery,
  useAddStudentGroupMutation,
  useUpdateStudentGroupMutation,
} = studentGroupsSlice;
