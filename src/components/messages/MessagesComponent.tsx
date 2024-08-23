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

  const [isDesktop, setIsDesktop] = useState<boolean>(
    window.innerWidth >= 1024
  );

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

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldShowNavigation = isDesktop || !otherUserId;
  const shouldShowChatAreaCloseIcon = !isDesktop && otherUserId;

  if (isUserChatsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["messages-container"]}>
      <div
        className={`${styles.navigation} ${
          !shouldShowNavigation ? styles["hidden-on-mobile"] : ""
        }`}
      >
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
        {otherUserId > 0 && (
          <MessageArea
            chatMessages={chatMessages}
            user={user}
            refetchChatMessages={refetchChatMessages}
            setOtherUserId={setOtherUserId}
            shouldShowChatAreaCloseIcon={shouldShowChatAreaCloseIcon}
          />
        )}
      </div>
    </div>
  );
};
export default MessagesComponent;
