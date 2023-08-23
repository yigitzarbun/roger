import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface StudentGroup {
  student_group_id: number;
  registered_at: string;
  student_group_name: string;
  is_active: boolean;
  club_id?: number;
  trainer_id?: number;
}

export const studentGroupsSlice = createApi({
  reducerPath: "studentGroups",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getStudentGroups: builder.query({
      query: () => "/student-groups",
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
  useAddStudentGroupMutation,
  useUpdateStudentGroupMutation,
} = studentGroupsSlice;