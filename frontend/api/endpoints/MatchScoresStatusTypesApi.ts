import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../../backend/src/common/constants/apiConstants";

export interface MatchScoresStatusType {
  match_score_status_type_id: number;
  match_score_status_type_name: string;
}

export const matchScoresStatusTypesSlice = createApi({
  reducerPath: "matchScoresStatusTypes",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getMatchScoresStatusTypes: builder.query({
      query: () => "/match-scores-status-types",
    }),
  }),
});

export const { useGetMatchScoresStatusTypesQuery } =
  matchScoresStatusTypesSlice;
