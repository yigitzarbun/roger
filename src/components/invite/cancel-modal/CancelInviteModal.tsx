import React from "react";

import ReactModal from "react-modal";

import styles from "./styles.module.scss";

import { useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useGetUsersQuery } from "../../../store/auth/apiSlice";
import { useGetTrainersQuery } from "../../../api/endpoints/TrainersApi";
import { useGetClubsQuery } from "../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../api/endpoints/CourtsApi";
import { useGetUserTypesQuery } from "../../../api/endpoints/UserTypesApi";
import { useAppSelector } from "../../../store/hooks";

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
};

interface CancelInviteModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleCancelBooking: () => void;
  bookingData: BookingData;
}
const CancelInviteModal = (props: CancelInviteModalProps) => {
  const { isModalOpen, handleCloseModal, bookingData, handleCancelBooking } =
    props;
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

  const isUserInviter = bookingData?.inviter_id === user.user_id;
  const isUserInvitee = bookingData?.invitee_id === user.user_id;

  const oppositionUser = isUserInviter
    ? users?.find((user) => user.user_id === bookingData?.invitee_id)
    : isUserInvitee &&
      users?.find((user) => user.user_id === bookingData?.inviter_id);

  const opposition =
    oppositionUser.user_type_id === 1
      ? players?.find((player) => player.user_id === oppositionUser.user_id)
      : oppositionUser.user_type_id === 2 &&
        trainers?.find((trainer) => trainer.user_id === oppositionUser.user_id);

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
      isOpen={isModalOpen}
      onRequestClose={handleCloseModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>
          {Number(bookingData?.event_type_id) === 3
            ? "Ders İptal"
            : Number(bookingData?.event_type_id) === 2
            ? "Maç İptal"
            : "Antreman İptal"}
        </h1>
        <img
          src="/images/icons/close.png"
          onClick={handleCloseModal}
          className={styles["close-button"]}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>{bookingData?.event_type_id === 3 ? "Eğitmen" : "Oyuncu"}</th>
            <th>İsim</th>
            <th>Tarih</th>
            <th>Saat</th>
            <th>Konum</th>
            <th>Kort</th>
            {user.user_type_id === 1 && <th>Kort Ücreti (TL)</th>}
            {bookingData?.event_type_id === 3 && <th>Ders Ücreti (TL)</th>}
            {user.user_type_id === 1 && <th>Toplam Tutar (TL)</th>}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img />
            </td>
            <td>{`${opposition.fname} ${opposition.lname}`}</td>
            <td>{bookingData?.event_date}</td>
            <td>{bookingData?.event_time}</td>
            <td>
              {
                clubs?.find(
                  (club) => club.club_id === Number(bookingData?.club_id)
                )?.club_name
              }
            </td>
            <td>
              {
                courts?.find(
                  (court) => court.court_id === Number(bookingData?.court_id)
                )?.court_name
              }
            </td>
            <td>
              {isUserPlayer &&
                (bookingData.event_type_id === 1 ||
                  bookingData.event_type_id === 2) &&
                courts?.find(
                  (court) => court.court_id === Number(bookingData?.court_id)
                )?.price_hour / 2}
              {isUserPlayer &&
                bookingData.event_type_id === 3 &&
                courts?.find(
                  (court) => court.court_id === Number(bookingData?.court_id)
                )?.price_hour}
            </td>
            {bookingData?.event_type_id === 3 && (
              <td>
                {isUserTrainer &&
                  trainers?.find((trainer) => trainer.user_id === user.user_id)
                    ?.price_hour}
                {isUserPlayer &&
                  isUserInvitee &&
                  trainers?.find(
                    (trainer) => trainer.user_id === bookingData?.inviter_id
                  )?.price_hour}
                {isUserPlayer &&
                  isUserInviter &&
                  trainers?.find(
                    (trainer) => trainer.user_id === bookingData?.invitee_id
                  )?.price_hour}
              </td>
            )}
            {isUserPlayer &&
              bookingData?.event_type_id === 3 &&
              isUserInviter && (
                <td>
                  {courts?.find(
                    (court) => court.court_id === bookingData?.court_id
                  )?.price_hour +
                    trainers?.find(
                      (trainer) => trainer.user_id === bookingData?.invitee_id
                    ).price_hour}
                </td>
              )}
            {isUserPlayer &&
              bookingData?.event_type_id === 3 &&
              isUserInvitee && (
                <td>
                  {courts?.find(
                    (court) => court.court_id === bookingData?.court_id
                  )?.price_hour +
                    trainers?.find(
                      (trainer) => trainer.user_id === bookingData?.inviter_id
                    )?.price_hour}
                </td>
              )}
            {(isUserPlayer && bookingData?.event_type_id === 1) ||
              (isUserPlayer && bookingData?.event_type_id === 2 && (
                <td>
                  {courts?.find(
                    (court) => court.court_id === bookingData?.court_id
                  )?.price_hour / 2}
                </td>
              ))}
          </tr>
        </tbody>
      </table>
      <button onClick={handleCancelBooking}>Onayla</button>
    </ReactModal>
  );
};
export default CancelInviteModal;
