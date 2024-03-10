import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface Language {
  language_id: number;
  language_name: string;
}

export const languagesSlice = createApi({
  reducerPath: "languages",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getLanguages: builder.query({
      query: () => "/languages",
    }),
  }),
});

export const { useGetLanguagesQuery } = languagesSlice;
