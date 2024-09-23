import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { imageUrl } from "../../../common/constants/apiConstants";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useAddMessageMutation } from "../../../../api/endpoints/MessagesApi";
import { toast } from "react-toastify";
import { useGetPlayerByUserIdQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetTrainerByUserIdQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetClubByUserIdQuery } from "../../../../api/endpoints/ClubsApi";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

interface MessageAreaProps {
  chatMessages: any[];
  user: any;
  refetchChatMessages: () => void;
  setOtherUserId: (e: any) => void;
  shouldShowChatAreaCloseIcon: boolean;
}

const MessageArea = (props: MessageAreaProps) => {
  const {
    chatMessages,
    user,
    refetchChatMessages,
    setOtherUserId,
    shouldShowChatAreaCloseIcon,
  } = props;

  const { t } = useTranslation();

  const isUserPlayer = user?.user_type_id === 1;

  const isUserTrainer = user?.user_type_id === 2;

  const isUserClub = user?.user_type_id === 3;

  const [skipPlayerDetails, setSkipPlayerDetails] = useState(true);

  const { data: playerDetails, isLoading: isPlayerDetailsLoading } =
    useGetPlayerByUserIdQuery(user?.user_id, { skip: skipPlayerDetails });

  const [skipTrainerDetails, setSkipTrainerDetails] = useState(true);

  const { data: trainerDetails, isLoading: isTrainerDetailsLoading } =
    useGetTrainerByUserIdQuery(user?.user_id, { skip: skipTrainerDetails });

  const [skipClubDetails, setSkipClubDetails] = useState(true);

  const { data: clubDetails, isLoading: isClubDetailsLoading } =
    useGetClubByUserIdQuery(user?.user_id, { skip: skipClubDetails });

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  const convertToMinutesAgo = (dateString: string) => {
    const date = parseISO(dateString);
    let result = formatDistanceToNow(date, { addSuffix: true });
    result = result.replace(/^about /, "");
    return result;
  };

  const [message, setMessage] = useState("");

  const handleMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const [addMessage, { isSuccess: isAddMessageSuccess }] =
    useAddMessageMutation({});

  const handleSend = () => {
    if (message === "") {
      toast.error("Lütfen mesajınızı yazın");
      return;
    }
    const messageObject = {
      is_active: true,
      message_content: message,
      sender_id: user?.user_id,
      recipient_id:
        chatMessages?.[0]?.message_sender_user_id === user?.user_id
          ? chatMessages?.[0]?.message_recipient_user_id
          : chatMessages?.[0]?.message_recipient_user_id === user?.user_id
          ? chatMessages?.[0]?.message_sender_user_id
          : null,
    };
    addMessage(messageObject);
  };

  useEffect(() => {
    if (isAddMessageSuccess) {
      refetchChatMessages();
      setMessage("");
    }
  }, [isAddMessageSuccess]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (isUserPlayer) {
      setSkipPlayerDetails(false);
    } else if (isUserTrainer) {
      setSkipTrainerDetails(false);
    } else if (isUserClub) {
      setSkipClubDetails(false);
    }
  }, []);

  return (
    <div className={styles["message-area-container"]}>
      {shouldShowChatAreaCloseIcon && (
        <div onClick={() => setOtherUserId(null)} className={styles.back}>
          <IoArrowBackCircleOutline />
          <p>{t("messagesTitle")}</p>
        </div>
      )}

      <div className={styles["messages-container"]} ref={messagesContainerRef}>
        {chatMessages?.length > 0
          ? chatMessages?.map((message) => (
              <div key={message.message_id}>
                {message?.message_sender_user_id === user?.user_id ? (
                  <div className={styles["current-user-message-container"]}>
                    <div className={styles["texts-outer-container"]}>
                      <div className={styles["title-container"]}>
                        <h5>{t("you")}</h5>
                        <p>{convertToMinutesAgo(message?.registered_at)}</p>
                      </div>
                      <div className={styles["texts-container"]}>
                        <p>{message?.message_content}</p>
                      </div>
                    </div>
                    <img
                      src={
                        playerDetails && playerDetails?.[0]?.image
                          ? `${imageUrl}/${playerDetails?.[0]?.image}`
                          : trainerDetails && trainerDetails?.[0]?.image
                          ? `${imageUrl}/${trainerDetails?.[0]?.image}`
                          : clubDetails && clubDetails?.[0]?.image
                          ? `${imageUrl}/${clubDetails?.[0]?.image}`
                          : "/images/icons/avatar.jpg"
                      }
                    />
                  </div>
                ) : (
                  <div className={styles["other-user-message-container"]}>
                    <img
                      src={
                        message?.player_image
                          ? `${imageUrl}/${message?.player_image}`
                          : message?.trainer_image
                          ? `${imageUrl}/${message?.trainer_image}`
                          : message?.club_image
                          ? `${imageUrl}/${message?.club_image}`
                          : "/images/icons/avatar.jpg"
                      }
                    />
                    <div className={styles["texts-outer-container"]}>
                      <div className={styles["title-container"]}>
                        <h5>
                          {message?.player_fname
                            ? `${message?.player_fname} ${message?.player_lname}`
                            : message?.trainer_fname
                            ? `${message?.trainer_fname} ${message?.trainer_lname}`
                            : message?.club_name
                            ? message?.club_name
                            : "-"}
                        </h5>
                        <p>{convertToMinutesAgo(message?.registered_at)}</p>
                      </div>
                      <div className={styles["texts-container"]}>
                        <p className={styles.message}>
                          {message?.message_content}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          : ""}
      </div>
      {chatMessages?.length > 0 && (
        <div className={styles["message-box"]}>
          <textarea
            onChange={handleMessage}
            placeholder={t("messageAreaPlaceholder")}
            value={message}
          />
          <button onClick={handleSend}>{t("send")}</button>
        </div>
      )}
    </div>
  );
};

export default MessageArea;
