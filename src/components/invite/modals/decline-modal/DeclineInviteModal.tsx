import React from "react";

import ReactModal from "react-modal";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetUsersQuery } from "../../../../store/auth/apiSlice";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetUserTypesQuery } from "../../../../api/endpoints/UserTypesApi";
import { useGetPaymentsQuery } from "../../../../api/endpoints/PaymentsApi";
import PageLoading from "../../../../components/loading/PageLoading";

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
  declineBookingData: DeclineBookingData;
  handleDeclineBooking: () => void;
}
const DeclineInviteModal = (props: DeclineInviteModalProps) => {
  const {
    isDeclineModalOpen,
    handleCloseDeclineModal,
    declineBookingData,
    handleDeclineBooking,
  } = props;

  const user = useAppSelector((store) => store.user.user.user);

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});
  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );
  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});
  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});
  const { data: payments, isLoading: isPaymentsLoading } = useGetPaymentsQuery(
    {}
  );

  const isUserPlayer = user.user_type_id === 1;
  const isUserTrainer = user.user_type_id === 2;

  const isUserInviter = declineBookingData?.inviter_id === user.user_id;
  const isUserInvitee = declineBookingData?.invitee_id === user.user_id;

  const oppositionUser = isUserInviter
    ? users?.find((user) => user.user_id === declineBookingData?.invitee_id)
    : isUserInvitee &&
      users?.find((user) => user.user_id === declineBookingData?.inviter_id);

  const opposition =
    oppositionUser.user_type_id === 1
      ? players?.find((player) => player.user_id === oppositionUser.user_id)
      : oppositionUser.user_type_id === 2 &&
        trainers?.find((trainer) => trainer.user_id === oppositionUser.user_id);

  const isEventTraining = declineBookingData?.event_type_id === 1;
  const isEventMatch = declineBookingData?.event_type_id === 2;
  const isEventLesson = declineBookingData?.event_type_id === 3;

  if (
    isUsersLoading ||
    isPlayersLoading ||
    isTrainersLoading ||
    isClubsLoading ||
    isCourtsLoading ||
    isPaymentsLoading
  ) {
    return <PageLoading />;
  }
  return (
    <ReactModal
      isOpen={isDeclineModalOpen}
      onRequestClose={handleCloseDeclineModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>
          {Number(declineBookingData?.event_type_id) === 3
            ? "Ders Davetini Reddet"
            : Number(declineBookingData?.event_type_id) === 2
            ? "Maç Davetini Reddet"
            : "Antreman Davetini Reddet"}
        </h1>
        <img
          src="/images/icons/close.png"
          onClick={handleCloseDeclineModal}
          className={styles["close-button"]}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>
              {isEventLesson && isUserPlayer
                ? "Eğitmen"
                : isEventLesson && isUserTrainer && "Oyuncu"}
            </th>
            <th>İsim</th>
            <th>Tarih</th>
            <th>Saat</th>
            <th>Konum</th>
            <th>Kort</th>
            {isUserPlayer && <th>Kort Ücreti (TL)</th>}
            {isEventLesson && <th>Ders Ücreti (TL)</th>}
            {isUserPlayer && <th>Toplam Tutar (TL)</th>}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img
                src={
                  opposition?.image
                    ? opposition?.image
                    : "/images/players/player1.png"
                }
                className={styles["player-image"]}
              />
            </td>
            <td>{`${opposition.fname} ${opposition.lname}`}</td>
            <td>
              {new Date(declineBookingData?.event_date).toLocaleDateString()}
            </td>
            <td>{declineBookingData?.event_time.slice(0, 5)}</td>
            <td>
              {
                clubs?.find(
                  (club) => club.club_id === Number(declineBookingData?.club_id)
                )?.club_name
              }
            </td>
            <td>
              {
                courts?.find(
                  (court) =>
                    court.court_id === Number(declineBookingData?.court_id)
                )?.court_name
              }
            </td>
            {/* kort ücreti */}
            {isUserPlayer && (
              <td>
                {
                  payments?.find(
                    (payment) =>
                      payment.payment_id === declineBookingData?.payment_id
                  )?.court_price
                }
              </td>
            )}

            {/* ders ücreti */}
            {isEventLesson && (
              <td>
                {
                  payments?.find(
                    (payment) =>
                      payment.payment_id === declineBookingData?.payment_id
                  )?.lesson_price
                }
              </td>
            )}
            {/* toplam ücret */}
            {isUserPlayer && isEventLesson && (
              <td>
                {
                  payments?.find(
                    (payment) =>
                      payment.payment_id === declineBookingData?.payment_id
                  )?.payment_amount
                }
              </td>
            )}
            {((isUserPlayer && isEventTraining) ||
              (isUserPlayer && isEventMatch)) && (
              <td>
                {payments?.find(
                  (payment) =>
                    payment.payment_id === declineBookingData?.payment_id
                )?.payment_amount / 2}
              </td>
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
      {isUserPlayer &&
        (declineBookingData?.event_type_id === 1 ||
          declineBookingData?.event_type_id === 2) && (
          <p className={styles["fee-text"]}>
            Kort ücreti oyuncular arasında yarı yarıya bölüşülür. Tahsil
            edilecek tutar Toplam Tutar'dır.
          </p>
        )}
      <button onClick={handleDeclineBooking}>Onayla</button>
    </ReactModal>
  );
};
export default DeclineInviteModal;
