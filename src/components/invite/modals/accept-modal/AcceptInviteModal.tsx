import React from "react";

import ReactModal from "react-modal";

import styles from "./styles.module.scss";

import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetUsersQuery } from "../../../../store/auth/apiSlice";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetUserTypesQuery } from "../../../../api/endpoints/UserTypesApi";
import { useAppSelector } from "../../../../store/hooks";

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
};

interface AcceptInviteModalProps {
  isAcceptModalOpen: boolean;
  handleCloseAcceptModal: () => void;
  handleAcceptBooking: () => void;
  acceptBookingData: AcceptBookingData;
}
const AcceptInviteModal = (props: AcceptInviteModalProps) => {
  const {
    isAcceptModalOpen,
    handleCloseAcceptModal,
    acceptBookingData,
    handleAcceptBooking,
  } = props;

  const user = useAppSelector((store) => store.user.user.user);

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});
  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );
  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});
  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});
  const { data: userTypes, isLoading: isUserTypesLoading } =
    useGetUserTypesQuery({});

  const isUserPlayer = user.user_type_id === 1;
  const isUserTrainer = user.user_type_id === 2;

  const isUserInviter = acceptBookingData?.inviter_id === user.user_id;
  const isUserInvitee = acceptBookingData?.invitee_id === user.user_id;

  const oppositionUser = isUserInviter
    ? users?.find((user) => user.user_id === acceptBookingData?.invitee_id)
    : isUserInvitee &&
      users?.find((user) => user.user_id === acceptBookingData?.inviter_id);

  const opposition =
    oppositionUser.user_type_id === 1
      ? players?.find((player) => player.user_id === oppositionUser.user_id)
      : oppositionUser.user_type_id === 2 &&
        trainers?.find((trainer) => trainer.user_id === oppositionUser.user_id);

  const isEventTraining = acceptBookingData?.event_type_id === 1;
  const isEventMatch = acceptBookingData?.event_type_id === 2;
  const isEventLesson = acceptBookingData?.event_type_id === 3;

  if (
    isUsersLoading ||
    isPlayersLoading ||
    isTrainersLoading ||
    isClubsLoading ||
    isCourtsLoading ||
    isUserTypesLoading
  ) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <ReactModal
      isOpen={isAcceptModalOpen}
      onRequestClose={handleCloseAcceptModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>
          {isEventLesson
            ? "Ders Onay"
            : isEventMatch
            ? "Maç Onay"
            : isEventTraining
            ? "Antreman Onay"
            : ""}
        </h1>
        <img
          src="/images/icons/close.png"
          onClick={handleCloseAcceptModal}
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
              <img />
            </td>
            <td>{`${opposition.fname} ${opposition.lname}`}</td>
            <td>
              {new Date(acceptBookingData?.event_date).toLocaleDateString()}
            </td>
            <td>{acceptBookingData?.event_time.slice(0, 5)}</td>
            <td>
              {
                clubs?.find(
                  (club) => club.club_id === Number(acceptBookingData?.club_id)
                )?.club_name
              }
            </td>
            <td>
              {
                courts?.find(
                  (court) =>
                    court.court_id === Number(acceptBookingData?.court_id)
                )?.court_name
              }
            </td>
            {/* kort ücreti */}
            {isUserPlayer && (
              <td>
                {(isEventTraining || isEventMatch) &&
                  courts?.find(
                    (court) =>
                      court.court_id === Number(acceptBookingData?.court_id)
                  )?.price_hour / 2}
                {isEventLesson &&
                  courts?.find(
                    (court) =>
                      court.court_id === Number(acceptBookingData?.court_id)
                  )?.price_hour}
              </td>
            )}

            {/* ders ücreti */}
            {isEventLesson && (
              <td>
                {isUserTrainer &&
                  trainers?.find((trainer) => trainer.user_id === user.user_id)
                    ?.price_hour}
                {isUserPlayer &&
                  isUserInvitee &&
                  trainers?.find(
                    (trainer) =>
                      trainer.user_id === acceptBookingData?.inviter_id
                  )?.price_hour}
                {isUserPlayer &&
                  isUserInviter &&
                  trainers?.find(
                    (trainer) =>
                      trainer.user_id === acceptBookingData?.invitee_id
                  )?.price_hour}
              </td>
            )}
            {/* toplam ücret */}
            {isUserPlayer && isEventLesson && isUserInviter && (
              <td>
                {courts?.find(
                  (court) => court.court_id === acceptBookingData?.court_id
                )?.price_hour +
                  trainers?.find(
                    (trainer) =>
                      trainer.user_id === acceptBookingData?.invitee_id
                  ).price_hour}
              </td>
            )}
            {isUserPlayer && isEventLesson && isUserInvitee && (
              <td>
                {courts?.find(
                  (court) => court.court_id === acceptBookingData?.court_id
                )?.price_hour +
                  trainers?.find(
                    (trainer) =>
                      trainer.user_id === acceptBookingData?.inviter_id
                  )?.price_hour}
              </td>
            )}
            {((isUserPlayer && isEventTraining) ||
              (isUserPlayer && isEventMatch)) && (
              <td>
                {courts?.find(
                  (court) => court.court_id === acceptBookingData?.court_id
                )?.price_hour / 2}
              </td>
            )}
          </tr>
        </tbody>
      </table>
      <button onClick={handleAcceptBooking}>Onayla</button>
    </ReactModal>
  );
};
export default AcceptInviteModal;
