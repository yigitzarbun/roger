import React, { ChangeEvent, useEffect, useState } from "react";

import ReactModal from "react-modal";

import styles from "./styles.module.scss";

import {
  useAddMessageMutation,
  useGetMessageByUserIdQuery,
  useGetPaginatedMessageRecipientsListByFilterQuery,
} from "../../../../api/endpoints/MessagesApi";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../store/hooks";

interface NewMessageModalProps {
  newMessageModal: boolean;
  closeNewMessageModal: () => void;
}

const NewMessageModal = (props: NewMessageModalProps) => {
  const { newMessageModal, closeNewMessageModal } = props;
  const user = useAppSelector((store) => store.user?.user?.user);
  const {
    data: potentialRecipientsList,
    isLoading: isPotentialRecipientsListLoading,
  } = useGetPaginatedMessageRecipientsListByFilterQuery({
    currentPage: 1,
    textSearch: "",
    userTypeId: null,
  });
  console.log(potentialRecipientsList);
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
      recipient_id: 0,
    };
    addMessage(messageObject);
  };

  useEffect(() => {
    if (isAddMessageSuccess) {
      toast.success("Mesaj gönderildi");
      refetch();
      setMessage("");
      closeNewMessageModal();
    }
  }, [isAddMessageSuccess]);

  return (
    <ReactModal
      isOpen={newMessageModal}
      onRequestClose={closeNewMessageModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeNewMessageModal} />
      <div className={styles["modal-content"]}>
        <div className={styles["top-container"]}>
          <h1>Yeni Mesaj</h1>
        </div>
        <input type="text" placeholder="Kime mesaj atmak istersin?" />
        <textarea onChange={handleMessage} placeholder="Mesajın" />
        <div className={styles["buttons-container"]}>
          <button
            onClick={closeNewMessageModal}
            className={styles["discard-button"]}
          >
            İptal
          </button>
          <button
            onClick={handleSend}
            className={styles["submit-button"]}
            disabled={message === ""}
          >
            Gönder
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default NewMessageModal;
