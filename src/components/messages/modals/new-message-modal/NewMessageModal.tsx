import React, { ChangeEvent, useEffect, useState } from "react";

import ReactModal from "react-modal";

import styles from "./styles.module.scss";
import { localUrl } from "../../../../common/constants/apiConstants";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

import {
  useAddMessageMutation,
  useGetChatsByFilterQuery,
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
  const [textSearch, setTextSearch] = useState("");
  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };
  const handleClear = () => {
    setTextSearch("");
  };

  const [currentPage, setCurrentPage] = useState(1);

  const [userTypeId, setUserTypeId] = useState(null);

  const {
    data: potentialRecipientsList,
    isLoading: isPotentialRecipientsListLoading,
    refetch: refecthPotentialRecipientsList,
  } = useGetPaginatedMessageRecipientsListByFilterQuery({
    currentPage: currentPage,
    textSearch: textSearch,
    userTypeId: userTypeId,
  });

  const handleUserTypeId = (userTypeId) => {
    setUserTypeId(userTypeId);
  };

  const pageNumbers = [];
  for (let i = 1; i <= potentialRecipientsList?.totalPages; i++) {
    pageNumbers.push(i);
  }
  const handleEventPage = (e) => {
    setCurrentPage(Number(e.target.value));
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % potentialRecipientsList?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + potentialRecipientsList?.totalPages) %
        potentialRecipientsList?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };

  const [selectedRecipient, setSelectedRecipient] = useState(null);

  const handleSelectedRecipient = (recipient) => {
    setSelectedRecipient(recipient);
  };
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
      recipient_id: selectedRecipient?.playerUserId
        ? selectedRecipient?.playerUserId
        : selectedRecipient?.trainerUserId
        ? selectedRecipient?.trainerUserId
        : selectedRecipient?.clubUserId
        ? selectedRecipient?.clubUserId
        : null,
    };
    addMessage(messageObject);
  };

  const { refetch: refetchChats } = useGetChatsByFilterQuery({
    userId: user?.user_id,
    textSearch: "",
  });

  const handleCancel = () => {
    closeNewMessageModal();
    setSelectedRecipient(null);
  };
  useEffect(() => {
    if (isAddMessageSuccess) {
      toast.success("Mesaj gönderildi");
      refetchChats();
      setMessage("");
      closeNewMessageModal();
    }
  }, [isAddMessageSuccess]);

  useEffect(() => {
    refecthPotentialRecipientsList();
  }, [currentPage, textSearch, userTypeId]);

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
        {selectedRecipient === null ? (
          <>
            <div className={styles["search-container"]}>
              <input
                type="text"
                placeholder="Kime mesaj atmak istersin?"
                onChange={handleTextSearch}
                value={textSearch}
              />
              <button
                className={
                  textSearch !== ""
                    ? styles["active-clear-button"]
                    : styles["passive-clear-button"]
                }
                onClick={handleClear}
              >
                Temizle
              </button>
            </div>
            <div className={styles["user-type-filter"]}>
              <div className={styles["user-type-buttons"]}>
                <button
                  onClick={() => handleUserTypeId(null)}
                  className={
                    userTypeId === null
                      ? styles["active-button"]
                      : styles["passive-button"]
                  }
                >
                  Tüm
                </button>
                <button
                  onClick={() => handleUserTypeId(1)}
                  className={
                    userTypeId === 1
                      ? styles["active-button"]
                      : styles["passive-button"]
                  }
                >
                  Oyuncular
                </button>
                <button
                  onClick={() => handleUserTypeId(2)}
                  className={
                    userTypeId === 2
                      ? styles["active-button"]
                      : styles["passive-button"]
                  }
                >
                  Eğitmenler
                </button>
                <button
                  onClick={() => handleUserTypeId(3)}
                  className={
                    userTypeId === 3
                      ? styles["active-button"]
                      : styles["passive-button"]
                  }
                >
                  Kulüpler
                </button>
              </div>
              {potentialRecipientsList?.totalPages > 1 && (
                <div className={styles["navigation-container"]}>
                  <FaAngleLeft
                    onClick={handlePrevPage}
                    className={styles["nav-arrow"]}
                  />

                  <FaAngleRight
                    onClick={handleNextPage}
                    className={styles["nav-arrow"]}
                  />
                </div>
              )}
            </div>
            {potentialRecipientsList?.paginatedRecipients?.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Üye</th>
                    <th>İsim</th>
                    <th>Konum</th>
                  </tr>
                </thead>
                <tbody>
                  {potentialRecipientsList?.paginatedRecipients?.map(
                    (recipient) => (
                      <tr
                        key={
                          recipient?.playerUserId
                            ? recipient?.playerUserId
                            : recipient.trainerUserId
                            ? recipient.TrainerUserId
                            : recipient?.clubUserId
                            ? recipient?.clubUserId
                            : null
                        }
                        className={styles["user-row"]}
                        onClick={() => handleSelectedRecipient(recipient)}
                      >
                        <td>
                          <img
                            src={
                              recipient?.playerUserId && recipient?.playerImage
                                ? `${localUrl}/${recipient?.playerImage}`
                                : recipient.trainerUserId &&
                                  recipient?.trainerImage
                                ? `${localUrl}/${recipient?.trainerImage}`
                                : recipient?.clubUserId && recipient?.clubImage
                                ? `${localUrl}/${recipient?.clubImage}`
                                : "/images/icons/avatar.jpg"
                            }
                          />
                        </td>
                        <td>
                          {recipient?.playerUserId
                            ? `${recipient?.playerFname} ${recipient?.playerLname}`
                            : recipient.trainerUserId
                            ? `${recipient?.trainerFname} ${recipient?.trainerLname}`
                            : recipient?.clubUserId
                            ? recipient?.clubName
                            : null}
                        </td>
                        <td>{recipient?.location_name}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <p>Aradığınız kullanıcı bulunamadı</p>
            )}
            <div className={styles["pages-container"]}>
              {pageNumbers?.map((pageNumber) => (
                <button
                  key={pageNumber}
                  value={pageNumber}
                  onClick={handleEventPage}
                  className={
                    pageNumber === Number(currentPage)
                      ? styles["active-page"]
                      : styles["passive-page"]
                  }
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className={styles["selected-user-container"]}>
              <img
                src={
                  selectedRecipient?.playerUserId &&
                  selectedRecipient?.playerImage
                    ? `${localUrl}/${selectedRecipient?.playerImage}`
                    : selectedRecipient.trainerUserId &&
                      selectedRecipient?.trainerImage
                    ? `${localUrl}/${selectedRecipient?.trainerImage}`
                    : selectedRecipient?.clubUserId &&
                      selectedRecipient?.clubImage
                    ? `${localUrl}/${selectedRecipient?.clubImage}`
                    : "/images/icons/avatar.jpg"
                }
              />
              <p>
                {selectedRecipient?.playerUserId
                  ? `${selectedRecipient?.playerFname} ${selectedRecipient?.playerLname}`
                  : selectedRecipient.trainerUserId
                  ? `${selectedRecipient?.trainerFname} ${selectedRecipient?.trainerLname}`
                  : selectedRecipient?.clubUserId
                  ? selectedRecipient?.clubName
                  : null}
              </p>
            </div>
            <textarea onChange={handleMessage} placeholder="Mesajın" />
            <div className={styles["buttons-container"]}>
              <button
                onClick={handleCancel}
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
          </>
        )}
      </div>
    </ReactModal>
  );
};

export default NewMessageModal;
