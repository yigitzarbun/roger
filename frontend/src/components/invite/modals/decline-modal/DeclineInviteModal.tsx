import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { imageUrl } from "../../../../common/constants/apiConstants";

export type DeclineBookingData = {
  booking_id: number;
  event_type_id: number;
  event_date: string;
  event_time: string;
  booking_status_type_id: number;
  club_id: number;
  court_id: number;
  court_price: number;
  lesson_price: number | null;
  invitee_id: number;
  inviter_id: number;
  payment_id: number;
  invitation_note: string;
};

interface DeclineInviteModalProps {
  isDeclineModalOpen: boolean;
  handleCloseDeclineModal: () => void;
  declineBookingData: any;
  handleDeclineBooking: () => void;
  user: any;
}
const DeclineInviteModal = (props: DeclineInviteModalProps) => {
  const {
    isDeclineModalOpen,
    handleCloseDeclineModal,
    declineBookingData,
    handleDeclineBooking,
    user,
  } = props;

  const isUserPlayer = user?.user_type_id === 1;

  const isUserTrainer = user?.user_type_id === 2;

  const isEventTraining = declineBookingData?.event_type_id === 1;

  const isEventMatch = declineBookingData?.event_type_id === 2;

  const isEventLesson = declineBookingData?.event_type_id === 3;

  const { t } = useTranslation();

  return (
    <ReactModal
      isOpen={isDeclineModalOpen}
      onRequestClose={handleCloseDeclineModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseDeclineModal} />
      <div className={styles["modal-content"]}>
        <h1>{t("declineInvitation")}</h1>
        <div className={styles["opponent-container"]}>
          <img
            src={
              (isEventTraining || isEventMatch) &&
              declineBookingData?.playerImage
                ? `${imageUrl}/${declineBookingData?.playerImage}`
                : isEventLesson &&
                  isUserPlayer &&
                  declineBookingData?.trainerImage
                ? `${imageUrl}/${declineBookingData?.trainerImage}`
                : isEventLesson &&
                  isUserTrainer &&
                  declineBookingData?.playerImage
                ? `${imageUrl}/${declineBookingData?.playerImage}`
                : "images/icons/avatar.jpg"
            }
            className={styles["opponent-image"]}
          />
          <p className={styles["player-name"]}>
            {declineBookingData?.user_type_id === 6
              ? declineBookingData?.student_group_name
              : declineBookingData?.user_type_id === 2
              ? `${declineBookingData?.fname} ${declineBookingData?.lname}`
              : declineBookingData?.user_type_id === 1
              ? `${declineBookingData?.playerFname} ${declineBookingData?.playerLname}`
              : "-"}
          </p>
        </div>
        <table>
          <thead>
            <tr>
              <th>{t("tableDateHeader")}</th>
              <th>{t("tableTimeHeader")}</th>
              <th>{t("tableClubHeader")}</th>
              <th>{t("tableCourtHeader")}</th>
              {isUserPlayer && isEventLesson && <th>{t("courtFee")}</th>}
              {isEventLesson && <th>{t("headerLessonTitle")}</th>}
              {isUserPlayer && <th>{t("total")}</th>}
            </tr>
          </thead>
          <tbody>
            <tr className={styles["player-row"]}>
              <td>
                {new Date(declineBookingData?.event_date).toLocaleDateString()}
              </td>
              <td>{declineBookingData?.event_time.slice(0, 5)}</td>
              <td>{declineBookingData?.club_name}</td>
              <td>{declineBookingData?.court_name}</td>
              {/* kort ücreti */}
              {isUserPlayer && isEventLesson && (
                <td>{declineBookingData?.court_price} TL</td>
              )}

              {/* ders ücreti */}
              {isEventLesson && <td>{declineBookingData?.lesson_price} TL</td>}
              {/* toplam ücret */}
              {isUserPlayer && isEventLesson && (
                <td>
                  {declineBookingData?.lesson_price +
                    declineBookingData?.court_price}
                  TL
                </td>
              )}
              {((isUserPlayer && isEventTraining) ||
                (isUserPlayer && isEventMatch)) && (
                <td>{declineBookingData?.payment_amount / 2} TL</td>
              )}
            </tr>
          </tbody>
        </table>
        {declineBookingData?.invitation_note && (
          <div className={styles["note-container"]}>
            <h4 className={styles["invitation-title"]}>Davet Notu: </h4>
            <p>{`${declineBookingData?.invitation_note}`}</p>
          </div>
        )}
        <div className={styles["buttons-container"]}>
          <button
            onClick={handleCloseDeclineModal}
            className={styles["discard-button"]}
          >
            {t("discardButtonText")}
          </button>
          <button
            onClick={handleDeclineBooking}
            className={styles["submit-button"]}
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </ReactModal>
  );
};
export default DeclineInviteModal;
