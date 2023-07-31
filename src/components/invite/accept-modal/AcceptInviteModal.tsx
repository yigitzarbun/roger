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

  const user = useAppSelector((store) => store.user);

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
    (user) => user.user_id === Number(acceptBookingData?.invitee_id)
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
      isOpen={isAcceptModalOpen}
      onRequestClose={handleCloseAcceptModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>
          {Number(acceptBookingData?.event_type_id) === 3
            ? "Ders Onay"
            : Number(acceptBookingData?.event_type_id) === 2
            ? "Maç Onay"
            : "Antreman Onay"}
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
              {acceptBookingData?.event_type_id === 3 ? "Eğitmen" : "Oyuncu"}
            </th>
            <th>İsim</th>
            <th>Tarih</th>
            <th>Saat</th>
            <th>Konum</th>
            <th>Kort</th>
            {user.user.user.user_type_id === 1 && <th>Kort Ücreti (TL)</th>}
            {acceptBookingData?.event_type_id === 3 && (
              <th>Ders Ücreti (TL)</th>
            )}
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
                        player.user_id === Number(acceptBookingData?.invitee_id)
                    )?.fname
                  } ${
                    players?.find(
                      (player) =>
                        player.user_id === Number(acceptBookingData?.invitee_id)
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
            <td>
              {user.user.user.user_type_id === 1 &&
                courts?.find(
                  (court) =>
                    court.court_id === Number(acceptBookingData?.court_id)
                )?.price_hour / 2}
            </td>
            {acceptBookingData?.event_type_id === 3 && (
              <td>
                {
                  trainers?.find(
                    (trainer) => trainer.user_id === invitee.user_id
                  )?.price_hour
                }
              </td>
            )}
            {acceptBookingData?.event_type_id === 3 ? (
              <td className={styles["total-sum-text"]}>
                {courts?.find(
                  (court) =>
                    court.court_id === Number(acceptBookingData?.court_id)
                )?.price_hour +
                  trainers?.find(
                    (trainer) => trainer.user_id === invitee.user_id
                  )?.price_hour}
              </td>
            ) : (
              <td className={styles["total-sum-text"]}>
                {courts?.find(
                  (court) =>
                    court.court_id === Number(acceptBookingData?.court_id)
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
