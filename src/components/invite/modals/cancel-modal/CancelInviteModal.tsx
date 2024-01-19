import React from "react";

import ReactModal from "react-modal";

import styles from "./styles.module.scss";

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
};

const CancelInviteModal = (props) => {
  const {
    isModalOpen,
    handleCloseModal,
    bookingData,
    handleCancelBooking,
    user,
  } = props;

  const isUserPlayer = user.user_type_id === 1;

  const isEventTraining = bookingData?.event_type_id === 1;
  const isEventMatch = bookingData?.event_type_id === 2;
  const isEventLesson =
    bookingData?.event_type_id === 3 ||
    bookingData?.event_type_id === 5 ||
    bookingData?.event_type_id === 6;
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
            ? "Ders İptal"
            : isEventMatch
            ? "Maç İptal"
            : "Antreman İptal"}
        </h1>
        <div className={styles["opponent-container"]}>
          <img
            src={
              (isEventTraining || isEventMatch) && bookingData?.playerImage
                ? bookingData?.playerImage
                : isEventLesson && bookingData?.trainerImage
                ? bookingData?.trainerImage
                : "images/icons/avatar.jpg"
            }
            className={styles["opponent-image"]}
          />
          <p className={styles["player-name"]}>
            {bookingData?.user_type_id === 6
              ? bookingData?.student_group_name
              : `${bookingData?.fname} ${bookingData?.lname}`}
          </p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Saat</th>
              <th>Konum</th>
              <th>Kort</th>
              {isEventLesson && <th>Ders Ücreti (TL)</th>}
              {isUserPlayer && <th>Tutar (TL)</th>}
            </tr>
          </thead>
          <tbody>
            <tr className={styles["player-row"]}>
              <td>{new Date(bookingData?.event_date).toLocaleDateString()}</td>
              <td>{bookingData?.event_time.slice(0, 5)}</td>
              <td>{bookingData?.club_name}</td>
              <td>{bookingData?.court_name}</td>
              {/* ders ücreti */}
              {isEventLesson && (
                <td>
                  {bookingData?.lesson_price ? bookingData?.lesson_price : "-"}
                </td>
              )}
              {/* toplam ücret */}
              {isUserPlayer && isEventLesson && (
                <td>{bookingData?.payment_amount}</td>
              )}
              {((isUserPlayer && isEventTraining) ||
                (isUserPlayer && isEventMatch)) && (
                <td>{bookingData?.payment_amount / 2}</td>
              )}
            </tr>
          </tbody>
        </table>
        <div className={styles["buttons-container"]}>
          <button
            onClick={handleCloseModal}
            className={styles["discard-button"]}
          >
            İptal
          </button>
          <button
            onClick={handleCancelBooking}
            className={styles["submit-button"]}
          >
            Onayla
          </button>
        </div>
      </div>
    </ReactModal>
  );
};
export default CancelInviteModal;
