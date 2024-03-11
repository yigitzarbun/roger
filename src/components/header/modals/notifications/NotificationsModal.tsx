import React from "react";
import ReactModal from "react-modal";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import { FaRegCreditCard } from "react-icons/fa";
import { BiTennisBall } from "react-icons/bi";
import { MdOutlineComment } from "react-icons/md";

import Paths from "../../../../routing/Paths";

interface NotificationsModalProps {
  isNotificationsModalOpen: boolean;
  handleCloseNotificationsModal: () => void;
  user: any;
  hasBankDetails: boolean;
  incomingRequests: any;
  missingScoresLength: number;
  missingReviews: any;
}
const NotificationsModal = (props: NotificationsModalProps) => {
  const {
    isNotificationsModalOpen,
    handleCloseNotificationsModal,
    user,
    hasBankDetails,
    incomingRequests,
    missingScoresLength,
    missingReviews,
  } = props;

  // TO do
  // add:
  //accepted invitations
  //decline invitations
  //cancelled invitations

  return (
    <ReactModal
      isOpen={isNotificationsModalOpen}
      onRequestClose={handleCloseNotificationsModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={handleCloseNotificationsModal}
      />
      <div className={styles["modal-content"]}>
        {!hasBankDetails && (
          <div className={styles["menu-item"]}>
            <FaRegCreditCard className={styles.icon} />
            <Link to={Paths.PROFILE}>Ödeme bilgilerinizi ekleyin</Link>
          </div>
        )}
        {incomingRequests?.length > 0 &&
          incomingRequests?.map((request) => (
            <div className={styles["menu-item"]}>
              <BiTennisBall className={styles.icon} />
              <Link
                to={Paths.REQUESTS}
              >{`${request.fname} ${request.lname} ${request.event_type_name} daveti gönderdi`}</Link>
            </div>
          ))}
        {(missingScoresLength > 0 || missingReviews > 0) && (
          <div className={styles["menu-item"]}>
            <MdOutlineComment className={styles.icon} />
            <Link to={Paths.PERFORMANCE}>
              Yorumunuzu bekleyen etkinlikler var
            </Link>
          </div>
        )}
      </div>
    </ReactModal>
  );
};

export default NotificationsModal;
