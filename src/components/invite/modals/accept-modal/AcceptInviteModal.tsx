import React from "react";

import ReactModal from "react-modal";

import styles from "./styles.module.scss";

export type AcceptBookingData = {
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

interface AcceptInviteModalProps {
  isAcceptModalOpen: boolean;
  handleCloseAcceptModal: () => void;
  acceptBookingData: any;
  handleAcceptBooking: () => void;
  user: any;
}

const AcceptInviteModal = (props: AcceptInviteModalProps) => {
  const {
    isAcceptModalOpen,
    handleCloseAcceptModal,
    acceptBookingData,
    handleAcceptBooking,
    user,
  } = props;

  const isUserPlayer = user?.user_type_id === 1;
  const isUserTrainer = user?.user_type_id === 2;
  const isEventTraining = acceptBookingData?.event_type_id === 1;
  const isEventMatch = acceptBookingData?.event_type_id === 2;
  const isEventLesson = acceptBookingData?.event_type_id === 3;
  return (
    <ReactModal
      isOpen={isAcceptModalOpen}
      onRequestClose={handleCloseAcceptModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseAcceptModal} />
      <div className={styles["modal-content"]}>
        <h1>Daveti Onayla</h1>
        <div className={styles["opponent-container"]}>
          <img
            src={
              (isEventTraining || isEventMatch) &&
              acceptBookingData?.playerImage
                ? acceptBookingData?.playerImage
                : isEventLesson &&
                  isUserPlayer &&
                  acceptBookingData?.trainerImage
                ? acceptBookingData?.trainerImage
                : isEventLesson &&
                  isUserTrainer &&
                  acceptBookingData?.playerImage
                ? acceptBookingData?.playerImage
                : "images/icons/avatar.jpg"
            }
            className={styles["opponent-image"]}
          />
          <p className={styles["player-name"]}>
            {acceptBookingData?.user_type_id === 6
              ? acceptBookingData?.student_group_name
              : `${acceptBookingData?.fname} ${acceptBookingData?.lname}`}
          </p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Saat</th>
              <th>Konum</th>
              <th>Kort</th>
              <th>Tür</th>
              {isUserPlayer && isEventLesson && <th>Kort Ücreti</th>}
              {isEventLesson && <th>Ders Ücreti</th>}
              {isUserPlayer && <th>Toplam Tutar</th>}
            </tr>
          </thead>
          <tbody>
            <tr className={styles["player-row"]}>
              <td>
                {new Date(acceptBookingData?.event_date).toLocaleDateString()}
              </td>
              <td>{acceptBookingData?.event_time.slice(0, 5)}</td>
              <td>{acceptBookingData?.club_name}</td>
              <td>{acceptBookingData?.court_name}</td>
              <td>{acceptBookingData?.event_type_name}</td>
              {isUserPlayer && isEventLesson && (
                <td>{acceptBookingData?.court_price} TL</td>
              )}
              {isEventLesson && <td>{acceptBookingData?.lesson_price} TL</td>}
              {isUserPlayer && isEventLesson && (
                <td>
                  {acceptBookingData?.court_price +
                    acceptBookingData?.lesson_price}{" "}
                  TL
                </td>
              )}

              {((isUserPlayer && isEventTraining) ||
                (isUserPlayer && isEventMatch)) && (
                <td>{acceptBookingData?.payment_amount / 2} TL</td>
              )}
            </tr>
          </tbody>
        </table>
        {acceptBookingData?.invitation_note && (
          <div className={styles["note-container"]}>
            <h4 className={styles["invitation-title"]}>Davet Notu: </h4>
            <p>{`${acceptBookingData?.invitation_note}`}</p>
          </div>
        )}
        <div className={styles["buttons-container"]}>
          <button
            onClick={handleCloseAcceptModal}
            className={styles["discard-button"]}
          >
            İptal
          </button>
          <button
            onClick={handleAcceptBooking}
            className={styles["submit-button"]}
          >
            Onayla
          </button>
        </div>
      </div>
    </ReactModal>
  );
};
export default AcceptInviteModal;
