import React from "react";
import styles from "./styles.module.scss";
import { localUrl } from "../../../common/constants/apiConstants";

interface MessageAreaProps {
  chatMessages: any[];
  user: any;
}
const MessageArea = (props: MessageAreaProps) => {
  const { chatMessages, user } = props;
  return (
    <div className={styles["message-area-container"]}>
      {chatMessages?.length > 0 ? (
        chatMessages?.map((message) => (
          <div>
            {message?.message_sender_user_id === user?.user_id ? (
              <div
                className={styles["current-user-message-container"]}
                key={message.message_id}
              >
                <div className={styles["texts-container"]}>
                  <h6>Yiğit Zarbun</h6>
                  <p>{message?.message_content}</p>
                </div>
                <img src="/images/icons/avatar.jpg" />
              </div>
            ) : (
              <div
                className={styles["other-user-message-container"]}
                key={message.message_id}
              >
                <img
                  src={
                    message?.player_image
                      ? `${localUrl}/${message?.player_image}`
                      : message?.trainer_image
                      ? `${localUrl}/${message?.trainr_image}`
                      : message?.club_imae
                      ? `${localUrl}/${message?.club_image}`
                      : "/images/icons/avatar.jpg"
                  }
                />
                <div className={styles["texts-container"]}>
                  <h5>
                    {message?.player_fname
                      ? `${message?.player_fname} ${message?.player_lname}`
                      : message?.trainer_fname
                      ? `${message?.trainer_fname} ${message?.trainer_lname}`
                      : message?.club_name
                      ? message?.club_name
                      : "-"}
                  </h5>
                  <p className={styles.message}>{message?.message_content}</p>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Hiç mesaj yok </p>
      )}
    </div>
  );
};
export default MessageArea;
