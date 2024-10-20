import React, { ChangeEvent, useState } from "react";
import styles from "./styles.module.scss";
import { imageUrl } from "../../../common/constants/apiConstants";
import { formatDistanceToNow, parseISO } from "date-fns";
import NewMessageModal from "../modals/new-message-modal/NewMessageModal";
import { FaPlus } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

interface MessagesNavigationProps {
  userChats: any[];
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  textSearch: string;
  otherUserId: number;
  handleOtherUserId: (id: number, name: string, messageId: number) => void;
  user: any;
  messageId: number;
}
const MessagesNavigation = (props: MessagesNavigationProps) => {
  const {
    userChats,
    handleTextSearch,
    textSearch,
    otherUserId,
    handleOtherUserId,
    user,
    messageId,
  } = props;

  const convertToMinutesAgo = (dateString: string) => {
    const date = parseISO(dateString);
    let result = formatDistanceToNow(date, { addSuffix: true });
    result = result.replace(/^about /, "");
    return result;
  };

  const [newMessageModal, setNewMessageModal] = useState(false);

  const handleOpenNewMessageModal = () => {
    setNewMessageModal(true);
  };

  const closeNewMessageModal = () => {
    setNewMessageModal(false);
  };

  const { t } = useTranslation();

  return (
    <div className={styles.nav}>
      <div className={styles["title-container"]}>
        <h2>{t("messagesTitle")}</h2>
        <FaPlus
          className={styles["new-message-icon"]}
          onClick={handleOpenNewMessageModal}
        />
      </div>

      {((userChats?.length > 0 && textSearch === "") ||
        (userChats?.length === 0 && textSearch !== "") ||
        userChats?.length > 0) && (
        <div className={styles["search-container"]}>
          <input
            type="text"
            onChange={handleTextSearch}
            value={textSearch}
            placeholder={t("headerSearchPlaceholder")}
          />
        </div>
      )}

      {userChats?.length > 0 ? (
        userChats.map((chat) => (
          <div
            key={chat?.message_id}
            className={
              messageId === chat?.message_id
                ? styles["active-chat-container"]
                : styles["chat-container"]
            }
            onClick={() =>
              handleOtherUserId(
                chat?.sender_id === user?.user_id
                  ? chat?.recipient_id
                  : chat?.sender_id,
                chat?.player_fname
                  ? `${chat?.player_fname} ${chat?.player_lname}`
                  : chat?.trainer_fname
                  ? `${chat?.trainer_fname} ${chat?.trainer_lname}`
                  : chat?.club_name
                  ? chat?.club_name
                  : "-",
                chat?.message_id
              )
            }
          >
            <img
              src={
                chat?.player_image
                  ? `${imageUrl}/${chat?.player_image}`
                  : chat?.trainer_image
                  ? `${imageUrl}/${chat?.trainr_image}`
                  : chat?.club_imae
                  ? `${imageUrl}/${chat?.club_image}`
                  : "/images/icons/avatar.jpg"
              }
            />
            <div className={styles["user-container"]}>
              <h5>
                {chat?.player_fname
                  ? `${chat?.player_fname} ${chat?.player_lname}`
                  : chat?.trainer_fname
                  ? `${chat?.trainer_fname} ${chat?.trainer_lname}`
                  : chat?.club_name
                  ? chat?.club_name
                  : "-"}
              </h5>
              <p className={styles.message}>
                {chat?.message_content?.slice(0, 20) + "..."}
              </p>
            </div>
            <p className={styles.date}>
              {convertToMinutesAgo(chat?.registered_at)}
            </p>
          </div>
        ))
      ) : userChats?.length === 0 && textSearch === "" ? (
        <div className={styles["no-messages-container"]}>
          <h4>{t("noMessageTitle")}</h4>{" "}
          <button onClick={handleOpenNewMessageModal}>
            {t("newMessageTitle")}
          </button>
        </div>
      ) : (
        <p className={styles["no-user"]}>{t("noResult")}</p>
      )}
      {newMessageModal && (
        <NewMessageModal
          newMessageModal={newMessageModal}
          closeNewMessageModal={closeNewMessageModal}
        />
      )}
    </div>
  );
};
export default MessagesNavigation;
