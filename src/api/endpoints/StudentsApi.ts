import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface Student {
  student_id: number;
  registered_at: string;
  student_status: string;
  trainer_id?: number;
  player_id?: number;
  student_group_id?: number;
}

export const studentsSlice = createApi({
  reducerPath: "students",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => "/students",
    }),
    addStudent: builder.mutation({
      query: (student) => ({
        url: "/students",
        method: "POST",
        body: student,
      }),
    }),
    updateStudent: builder.mutation({
      query: (updatedStudent) => ({
        url: "/students",
        method: "PUT",
        body: updatedStudent,
      }),
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
} = studentsSlice;
