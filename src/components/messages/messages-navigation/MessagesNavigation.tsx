import React, { ChangeEvent, useState } from "react";
import styles from "./styles.module.scss";
import { localUrl } from "../../../common/constants/apiConstants";
import { formatDistanceToNow, parseISO } from "date-fns";
import NewMessageModal from "../modals/new-message-modal/NewMessageModal";

interface MessagesNavigationProps {
  userChats: any[];
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  textSearch: string;
  otherUserId: number;
  handleOtherUserId: (id: number) => void;
  user: any;
}
const MessagesNavigation = (props: MessagesNavigationProps) => {
  const {
    userChats,
    handleTextSearch,
    textSearch,
    otherUserId,
    handleOtherUserId,
    user,
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

  return (
    <div className={styles.nav}>
      <h2>Mesajlar</h2>
      {((userChats?.length > 0 && textSearch === "") ||
        (userChats?.length === 0 && textSearch !== "") ||
        userChats?.length > 0) && (
        <div className={styles["search-container"]}>
          <input
            type="text"
            onChange={handleTextSearch}
            value={textSearch}
            placeholder="Oyuncu, eğitmen veya kulüp adı"
          />
        </div>
      )}

      {userChats?.length > 0 ? (
        userChats.map((chat) => (
          <div
            key={chat?.message_id}
            className={styles["chat-container"]}
            onClick={() =>
              handleOtherUserId(
                chat?.sender_id === user?.user_id
                  ? chat?.recipient_id
                  : chat?.sender_id
              )
            }
          >
            <img
              src={
                chat?.player_image
                  ? `${localUrl}/${chat?.player_image}`
                  : chat?.trainer_image
                  ? `${localUrl}/${chat?.trainr_image}`
                  : chat?.club_imae
                  ? `${localUrl}/${chat?.club_image}`
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
          <h4>Henüz mesajınız yok</h4>{" "}
          <button onClick={handleOpenNewMessageModal}>Yeni Mesaj</button>
        </div>
      ) : (
        <p className={styles["no-user"]}>
          Aradığınız kritere göre kullanıcı bulunamadı
        </p>
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
