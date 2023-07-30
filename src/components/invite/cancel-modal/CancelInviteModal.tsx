import React from "react";

import ReactModal from "react-modal";

import styles from "./styles.module.scss";

import { useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useGetUsersQuery } from "../../../store/auth/apiSlice";
import { useGetTrainersQuery } from "../../../api/endpoints/TrainersApi";
import { useGetClubsQuery } from "../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../api/endpoints/CourtsApi";
import { useGetUserTypesQuery } from "../../../api/endpoints/UserTypesApi";

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
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});
  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );
  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});
  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});
  const { data: userTypes, isLoading: isUserTypesLoading } =
    useGetUserTypesQuery({});

  const invitee = users?.find(
    (user) => user.user_id === Number(bookingData?.invitee_id)
  );

  const inviteeUserTypeId = userTypes?.find(
    (type) => type.user_type_id === invitee?.user_type_id
  )?.user_type_id;

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
            <th>Kort Ücreti (TL)</th>
            {bookingData?.event_type_id === 3 && <th>Ders Ücreti (TL)</th>}
            <th>Toplam Tutar (TL)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img />
            </td>
            <td>
              {inviteeUserTypeId === 1
                ? `${
                    players?.find(
                      (player) =>
                        player.user_id === Number(bookingData?.invitee_id)
                    )?.fname
                  } ${
                    players?.find(
                      (player) =>
                        player.user_id === Number(bookingData?.invitee_id)
                    )?.lname
                  }`
                : inviteeUserTypeId === 2
                ? `${
                    trainers?.find(
                      (trainer) => trainer.user_id === invitee.user_id
                    )?.fname
                  } ${
                    trainers?.find(
                      (trainer) => trainer.user_id === invitee.user_id
                    )?.lname
                  }`
                : ""}
            </td>
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
              {
                courts?.find(
                  (court) => court.court_id === Number(bookingData?.court_id)
                )?.price_hour
              }
            </td>
            {bookingData?.event_type_id === 3 && (
              <td>
                {
                  trainers?.find(
                    (trainer) => trainer.user_id === invitee.user_id
                  )?.price_hour
                }
              </td>
            )}
            {bookingData?.event_type_id === 3 ? (
              <td className={styles["total-sum-text"]}>
                {courts?.find(
                  (court) => court.court_id === Number(bookingData?.court_id)
                )?.price_hour +
                  trainers?.find(
                    (trainer) => trainer.user_id === invitee.user_id
                  )?.price_hour}
              </td>
            ) : (
              <td className={styles["total-sum-text"]}>
                {
                  courts?.find(
                    (court) => court.court_id === Number(bookingData?.court_id)
                  )?.price_hour
                }
              </td>
            )}
          </tr>
        </tbody>
      </table>
      <button onClick={handleCancelBooking}>Onayla</button>
    </ReactModal>
  );
};
export default CancelInviteModal;
