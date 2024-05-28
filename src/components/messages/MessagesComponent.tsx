import React, { useState, ChangeEvent, useEffect } from "react";
import MessagesNavigation from "./messages-navigation/MessagesNavigation";
import { useAppSelector } from "../../store/hooks";
import {
  useGetChatMessagesByFilterQuery,
  useGetChatsByFilterQuery,
} from "../../api/endpoints/MessagesApi";
import PageLoading from "../../components/loading/PageLoading";
import MessageArea from "./message-area/MessageArea";
import styles from "./styles.module.scss";

const MessagesComponent = () => {
  const user = useAppSelector((store) => store?.user?.user?.user);
  const [textSearch, setTextSearch] = useState<string>("");
  const {
    data: userChats,
    isLoading: isUserChatsLoading,
    refetch: refetchChats,
  } = useGetChatsByFilterQuery({
    userId: user?.user_id,
    textSearch: textSearch,
  });

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const [otherUserId, setOtherUserId] = useState(null);
  const handleOtherUserId = (id: number) => {
    setOtherUserId(id);
  };
  const [skipChatMessages, setSkipChatMessages] = useState(true);

  const { data: chatMessages, refetch: refetchChatMessages } =
    useGetChatMessagesByFilterQuery(
      {
        userId: user?.user_id,
        otherUserId: otherUserId,
      },
      { skip: skipChatMessages }
    );

  useEffect(() => {
    refetchChats();
  }, [textSearch]);

  useEffect(() => {
    setSkipChatMessages(false);
  }, [otherUserId]);

  if (isUserChatsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["messages-container"]}>
      <div className={styles.navigation}>
        <MessagesNavigation
          userChats={userChats}
          handleTextSearch={handleTextSearch}
          textSearch={textSearch}
          otherUserId={otherUserId}
          handleOtherUserId={handleOtherUserId}
          user={user}
        />
      </div>
      <div className={styles["message-area"]}>
        <MessageArea
          chatMessages={chatMessages}
          user={user}
          refetchChatMessages={refetchChatMessages}
        />
      </div>
    </div>
  );
};
export default MessagesComponent;
