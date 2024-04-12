import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface Student {
  student_id: number;
  registered_at: string;
  student_status: string;
  trainer_id?: number;
  player_id?: number;
}

export const studentsSlice = createApi({
  reducerPath: "students",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => "/students",
    }),
    getStudentsByFilter: builder.query({
      query: (filter) => `/students/filter?${new URLSearchParams(filter)}`,
    }),
    getIsStudent: builder.query({
      query: (filter) =>
        `/students/is-student/filter?${new URLSearchParams(filter)}`,
    }),
    getPaginatedTrainerStudents: builder.query({
      query: (filter) =>
        `/students/paginated-trainer-students/filter?${new URLSearchParams(
          filter
        )}`,
    }),
    getTrainerNewStudentRequestsList: builder.query({
      query: (trainerUserId) =>
        `/students/trainer-new-student-requests-list/${trainerUserId}`,
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
  useGetStudentsByFilterQuery,
  useGetIsStudentQuery,
  useGetPaginatedTrainerStudentsQuery,
  useGetTrainerNewStudentRequestsListQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
} = studentsSlice;
