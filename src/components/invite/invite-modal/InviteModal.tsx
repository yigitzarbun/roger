import Modal from "react-modal";
import React from "react";

import styles from "./styles.module.scss";

import { useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useGetUsersQuery } from "../../../store/auth/apiSlice";
import { useGetTrainersQuery } from "../../../api/endpoints/TrainersApi";
import { useGetClubsQuery } from "../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../api/endpoints/CourtsApi";
import { useGetUserTypesQuery } from "../../../api/endpoints/UserTypesApi";

export type FormValues = {
  event_type_id: number;
  event_date: string;
  event_time: string;
  booking_status_type_id: number;
  club_id: number;
  court_id: number;
  court_price: number;
  lesson_price: number | null;
  invitee_id: string;
};

interface ModalProps {
  modal: boolean;
  handleModalSubmit: () => void;
  formData?: FormValues | null | undefined;
  handleCloseModal: () => void;
}

const InviteModal = ({
  modal,
  handleModalSubmit,
  formData,
  handleCloseModal,
}: ModalProps) => {
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
    (user) => user.user_id === Number(formData?.invitee_id)
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
    <Modal isOpen={modal} className={styles["modal-container"]}>
      <div className={styles["top-container"]}>
        <h1>
          {Number(formData?.event_type_id) === 3
            ? "Ders"
            : Number(formData?.event_type_id) === 2
            ? "Maç"
            : "Antreman"}
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
            <th>{formData?.event_type_id === 3 ? "Eğitmen" : "Oyuncu"}</th>
            <th>İsim</th>
            <th>Tarih</th>
            <th>Saat</th>
            <th>Konum</th>
            <th>Kort</th>
            <th>Kort Ücreti (TL)</th>
            {formData?.event_type_id === 3 && <th>Ders Ücreti (TL)</th>}
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
                        player.user_id === Number(formData?.invitee_id)
                    )?.fname
                  } ${
                    players?.find(
                      (player) =>
                        player.user_id === Number(formData?.invitee_id)
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
            <td>{new Date(formData.event_date).toLocaleDateString()}</td>
            <td>{formData?.event_time}</td>
            <td>
              {
                clubs?.find(
                  (club) => club.club_id === Number(formData?.club_id)
                )?.club_name
              }
            </td>
            <td>
              {
                courts?.find(
                  (court) => court.court_id === Number(formData?.court_id)
                )?.court_name
              }
            </td>
            <td>
              {courts?.find(
                (court) => court.court_id === Number(formData?.court_id)
              )?.price_hour / 2}
            </td>
            {formData?.event_type_id === 3 && (
              <td>
                {
                  trainers?.find(
                    (trainer) => trainer.user_id === invitee.user_id
                  )?.price_hour
                }
              </td>
            )}
            {formData?.event_type_id === 3 ? (
              <td className={styles["total-sum-text"]}>
                {courts?.find(
                  (court) => court.court_id === Number(formData?.court_id)
                )?.price_hour +
                  trainers?.find(
                    (trainer) => trainer.user_id === invitee.user_id
                  )?.price_hour}
              </td>
            ) : (
              <td className={styles["total-sum-text"]}>
                {courts?.find(
                  (court) => court.court_id === Number(formData?.court_id)
                )?.price_hour / 2}
              </td>
            )}
          </tr>
        </tbody>
      </table>
      <button onClick={handleModalSubmit}>Davet gönder</button>
    </Modal>
  );
};

export default InviteModal;
