import React, { ChangeEvent, useEffect, useState } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import {
  useAddMessageMutation,
  useGetMessageByUserIdQuery,
} from "../../../../api/endpoints/MessagesApi";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../store/hooks";
import { useTranslation } from "react-i18next";

interface MessageModalProps {
  messageModal: boolean;
  closeMessageModal: () => void;
  recipient_id: number;
}

const MessageModal = (props: MessageModalProps) => {
  const { messageModal, closeMessageModal, recipient_id } = props;

  const { t } = useTranslation();

  const user = useAppSelector((store) => store.user?.user?.user);

  const [message, setMessage] = useState("");

  const handleMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const { refetch } = useGetMessageByUserIdQuery(user?.user_id);

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
      recipient_id: recipient_id,
    };
    addMessage(messageObject);
  };

  useEffect(() => {
    if (isAddMessageSuccess) {
      toast.success("Mesaj gönderildi");
      refetch();
      setMessage("");
      closeMessageModal();
    }
  }, [isAddMessageSuccess]);

  return (
    <ReactModal
      isOpen={messageModal}
      onRequestClose={closeMessageModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeMessageModal} />
      <div className={styles["modal-content"]}>
        <div className={styles["top-container"]}>
          <h1>{t("newMessageTitle")}</h1>
        </div>
        <textarea onChange={handleMessage} />
        <div className={styles["buttons-container"]}>
          <button
            onClick={closeMessageModal}
            className={styles["discard-button"]}
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSend}
            className={styles["submit-button"]}
            disabled={message === ""}
          >
            {t("send")}
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default MessageModal;
