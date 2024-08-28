import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

export type BookingData = {
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
  invitation_note?: string;
  registered_at: string;
};

interface CancelInviteModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  bookingData: any;
  handleCancelBooking: () => void;
  user: any;
}
const CancelInviteModal = (props: CancelInviteModalProps) => {
  const {
    isModalOpen,
    handleCloseModal,
    bookingData,
    handleCancelBooking,
    user,
  } = props;

  const isUserPlayer = user?.user_type_id === 1;

  const isUserTrainer = user?.user_type_id === 2;

  const isEventTraining = bookingData?.event_type_id === 1;

  const isEventMatch = bookingData?.event_type_id === 2;

  const isEventLesson =
    bookingData?.event_type_id === 3 ||
    bookingData?.event_type_id === 5 ||
    bookingData?.event_type_id === 6;

  const { t } = useTranslation();

  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={handleCloseModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseModal} />
      <div className={styles["modal-content"]}>
        <h1>
          {isEventLesson
            ? t("cancelLessonTitle")
            : isEventMatch
            ? t("cancelMatchTitle")
            : t("cancelTrainingTitle")}
        </h1>
        <div className={styles["opponent-container"]}>
          <img
            src={
              (isEventTraining || isEventMatch) && bookingData?.playerImage
                ? bookingData?.playerImage
                : isEventLesson && isUserPlayer && bookingData?.trainerImage
                ? bookingData?.trainerImage
                : isEventLesson && isUserTrainer && bookingData?.playerImage
                ? bookingData?.playerImage
                : "images/icons/avatar.jpg"
            }
            className={styles["opponent-image"]}
          />
          <p className={styles["player-name"]}>
            {bookingData?.event_type_id === 6
              ? bookingData?.student_group_name
              : (bookingData?.event_type_id === 3 ||
                  bookingData?.event_type_id === 5) &&
                isUserTrainer
              ? `${bookingData?.playerFname} ${bookingData?.playerLname}`
              : `${bookingData?.fname} ${bookingData?.lname}`}
          </p>
        </div>
        <table>
          <thead>
            <tr>
              <th>{t("tableDateHeader")}</th>
              <th>{t("tableTimeHeader")}</th>
              <th>{t("tableClubHeader")}</th>
              <th>{t("tableCourtHeader")}</th>
              {isEventLesson && isUserTrainer && <th>{t("lessonFee")}</th>}
              {isUserPlayer && <th>{t("paymentAmount")}</th>}
            </tr>
          </thead>
          <tbody>
            <tr className={styles["player-row"]}>
              <td>{new Date(bookingData?.event_date).toLocaleDateString()}</td>
              <td>{bookingData?.event_time.slice(0, 5)}</td>
              <td>{bookingData?.club_name}</td>
              <td>{bookingData?.court_name}</td>
              {/* ders ücreti */}
              {isEventLesson && isUserTrainer && (
                <td>
                  {bookingData?.lesson_price
                    ? `${bookingData?.lesson_price} TL`
                    : "-"}
                </td>
              )}
              {/* toplam ücret */}
              {isUserPlayer && isEventLesson && (
                <td>
                  {bookingData?.lesson_price + bookingData?.court_price} TL
                </td>
              )}
              {((isUserPlayer && isEventTraining) ||
                (isUserPlayer && isEventMatch)) && (
                <td>{bookingData?.payment_amount / 2} TL</td>
              )}
            </tr>
          </tbody>
        </table>
        <div className={styles["buttons-container"]}>
          <button
            onClick={handleCloseModal}
            className={styles["discard-button"]}
          >
            {t("discardButtonText")}
          </button>
          <button
            onClick={handleCancelBooking}
            className={styles["submit-button"]}
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </ReactModal>
  );
};
export default CancelInviteModal;
