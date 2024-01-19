import React from "react";

import ReactModal from "react-modal";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";

import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetUsersQuery } from "../../../../store/auth/apiSlice";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetClubByClubIdQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtByIdQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetPaymentByIdQuery } from "../../../../api/endpoints/PaymentsApi";

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

const DeclineInviteModal = (props) => {
  const {
    isDeclineModalOpen,
    handleCloseDeclineModal,
    declineBookingData,
    handleDeclineBooking,
    user,
  } = props;

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});
  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: selectedClub, isLoading: isSelectedClubLoading } =
    useGetClubByClubIdQuery(declineBookingData?.club_id);

  const { data: selectedCourt, isLoading: isSelectedCourtLoading } =
    useGetCourtByIdQuery(declineBookingData?.court_id);

  const isUserPlayer = user.user_type_id === 1;

  const isEventTraining = declineBookingData?.event_type_id === 1;
  const isEventMatch = declineBookingData?.event_type_id === 2;
  const isEventLesson = declineBookingData?.event_type_id === 3;
  console.log(declineBookingData);
  if (
    isUsersLoading ||
    isPlayersLoading ||
    isTrainersLoading ||
    isSelectedClubLoading ||
    isSelectedCourtLoading
  ) {
    return <PageLoading />;
  }
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
        <h1>Daveti Reddet</h1>
        <div className={styles["opponent-container"]}>
          <img
            src={
              (isEventTraining || isEventMatch) &&
              declineBookingData?.playerImage
                ? declineBookingData?.playerImage
                : isEventLesson && declineBookingData?.trainerImage
                ? declineBookingData?.trainerImage
                : "images/icons/avatar.jpg"
            }
            className={styles["opponent-image"]}
          />
          <p className={styles["player-name"]}>
            {declineBookingData?.user_type_id === 6
              ? declineBookingData?.student_group_name
              : `${declineBookingData?.fname} ${declineBookingData?.lname}`}
          </p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Saat</th>
              <th>Konum</th>
              <th>Kort</th>
              {isUserPlayer && isEventLesson && <th>Kort</th>}
              {isEventLesson && <th>Ders</th>}
              {isUserPlayer && <th>Toplam</th>}
            </tr>
          </thead>
          <tbody>
            <tr>
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
                <td>{declineBookingData?.payment_amount} TL</td>
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
            onClick={handleDeclineBooking}
            className={styles["discard-button"]}
          >
            İptal
          </button>
          <button
            onClick={handleDeclineBooking}
            className={styles["submit-button"]}
          >
            Onayla
          </button>
        </div>
      </div>
    </ReactModal>
  );
};
export default DeclineInviteModal;
