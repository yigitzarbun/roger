import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../../backend/src/common/constants/apiConstants";

export const messagesSlice = createApi({
  reducerPath: "messages",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => "/messages",
    }),
    getMessageByUserId: builder.query({
      query: (userId) => `/messages/user-messages/${userId}`,
    }),
    getChatsByFilter: builder.query({
      query: (filter) =>
        `/messages/user-chats/filter?${new URLSearchParams(filter)}`,
    }),
    getChatMessagesByFilter: builder.query({
      query: (filter) =>
        `/messages/chat-messages/filter?${new URLSearchParams(filter)}`,
    }),
    getPaginatedMessageRecipientsListByFilter: builder.query({
      query: (filter) =>
        `/messages/paginated-recipients-list/filter?${new URLSearchParams(
          filter
        )}`,
    }),
    addMessage: builder.mutation({
      query: (message) => ({
        url: "/messages",
        method: "POST",
        body: message,
      }),
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useGetMessageByUserIdQuery,
  useGetChatsByFilterQuery,
  useGetChatMessagesByFilterQuery,
  useGetPaginatedMessageRecipientsListByFilterQuery,
  useAddMessageMutation,
} = messagesSlice;
