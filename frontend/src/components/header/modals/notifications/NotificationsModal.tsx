import React from "react";
import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import { FaRegCreditCard } from "react-icons/fa";
import { BiTennisBall } from "react-icons/bi";
import { MdOutlineComment } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import Paths from "../../../../routing/Paths";

interface NotificationsModalProps {
  isNotificationsModalOpen: boolean;
  handleCloseNotificationsModal: () => void;
  handleCloseMenuModal: () => void;
  user: any;
  hasBankDetails: boolean;
  playerIncomingRequests: any;
  missingScoresLength: number;
  missingReviews: any;
  isUserPlayer: boolean;
  isUserTrainer: boolean;
  isUserClub: boolean;
  myStaffRequests: any;
  trainerIncomingRequests: any;
  newStudentRequests: any;
}
const NotificationsModal = (props: NotificationsModalProps) => {
  const {
    isNotificationsModalOpen,
    handleCloseNotificationsModal,
    handleCloseMenuModal,
    user,
    hasBankDetails,
    playerIncomingRequests,
    missingScoresLength,
    missingReviews,
    isUserPlayer,
    isUserTrainer,
    isUserClub,
    myStaffRequests,
    trainerIncomingRequests,
    newStudentRequests,
  } = props;

  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(Paths[path]);
    handleCloseMenuModal();
    handleCloseNotificationsModal();
  };

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
            <p onClick={() => handleNavigate("PROFILE")}>
              {t("addPaymentDetailsButtonText")}
            </p>
          </div>
        )}
        {isUserPlayer &&
          playerIncomingRequests?.length > 0 &&
          playerIncomingRequests?.map((request) => (
            <div className={styles["menu-item"]} key={request.booking_id}>
              <BiTennisBall className={styles.icon} />
              <p onClick={() => handleNavigate("REQUESTS")}>
                {request?.user_type_id === 6
                  ? request?.student_group_name
                  : request?.user_type_id === 2
                  ? `${request?.fname} ${request?.lname}`
                  : request?.user_type_id === 1
                  ? `${request?.playerFname} ${request?.playerLname}`
                  : "-"}
                {` ${
                  request?.event_type_id === 1
                    ? t("training")
                    : request?.event_type_id === 2
                    ? t("match")
                    : request?.event_type_id === 3
                    ? t("lesson")
                    : request?.event_type_id === 4
                    ? t("externalTraining")
                    : request?.event_type_id === 5
                    ? t("externalLesson")
                    : request?.event_type_id === 6
                    ? t("groupLesson")
                    : request?.event_type_id === 7
                    ? t("tournamentMatch")
                    : ""
                } ${t("sentRequest")}`}
              </p>
            </div>
          ))}
        {isUserPlayer && (missingScoresLength > 0 || missingReviews > 0) && (
          <div className={styles["menu-item"]}>
            <MdOutlineComment className={styles.icon} />
            <p onClick={() => handleNavigate("PERFORMANCE")}>
              {t("missingReviewsExisting")}
            </p>
          </div>
        )}
        {isUserTrainer && missingReviews > 0 && (
          <div className={styles["menu-item"]}>
            <MdOutlineComment className={styles.icon} />
            <p onClick={() => handleNavigate("PERFORMANCE")}>
              {t("missingReviewsExisting")}
            </p>
          </div>
        )}
        {isUserTrainer && newStudentRequests?.length > 0 && (
          <div className={styles["menu-item"]}>
            <IoPeople className={styles.icon} />
            <p onClick={() => handleNavigate("STUDENTS")}>
              {t("newStudentRequest")}
            </p>
          </div>
        )}
        {isUserClub && myStaffRequests?.length > 0 && (
          <div className={styles["menu-item"]}>
            <IoPeople className={styles.icon} />
            <p onClick={() => handleNavigate("CLUB_STAFF")}>
              {t("newStaffRequest")}{" "}
            </p>
          </div>
        )}
        {isUserTrainer &&
          trainerIncomingRequests?.length > 0 &&
          trainerIncomingRequests?.map((request) => (
            <div className={styles["menu-item"]} key={request.booking_id}>
              <BiTennisBall className={styles.icon} />
              <p onClick={() => handleNavigate("REQUESTS")}>{`${
                request.fname
              } ${request.lname} ${
                request?.event_type_id === 1
                  ? t("training")
                  : request?.event_type_id === 2
                  ? t("match")
                  : request?.event_type_id === 3
                  ? t("lesson")
                  : request?.event_type_id === 4
                  ? t("externalTraining")
                  : request?.event_type_id === 5
                  ? t("externalLesson")
                  : request?.event_type_id === 6
                  ? t("groupLesson")
                  : request?.event_type_id === 7
                  ? t("tournamentMatch")
                  : ""
              } ${t("sentRequest")}`}</p>
            </div>
          ))}
      </div>
    </ReactModal>
  );
};

export default NotificationsModal;
