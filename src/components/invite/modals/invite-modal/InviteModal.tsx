import React from "react";

import Modal from "react-modal";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetUsersQuery } from "../../../../store/auth/apiSlice";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetClubByClubIdQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtByIdQuery } from "../../../../api/endpoints/CourtsApi";
import { useAppSelector } from "../../../../store/hooks";
import {
  useGetClubSubscriptionsByFilterQuery,
  useGetClubSubscriptionsQuery,
} from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetClubStaffQuery } from "../../../../api/endpoints/ClubStaffApi";

export type FormValues = {
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
  const user = useAppSelector((store) => store.user?.user.user);

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});
  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );
  const { data: selectedClub, isLoading: isSelectedClubLoading } =
    useGetClubByClubIdQuery(Number(formData?.club_id));

  const { data: selectedCourt, isLoading: isCourtsLoading } =
    useGetCourtByIdQuery(Number(formData?.court_id));

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});
  const { data: clubStaff, isLoading: isClubStaffLoading } =
    useGetClubStaffQuery({});

  const isUserPlayer = user?.user_type_id === 1;
  const isUserTrainer = user?.user_type_id === 2;

  const isUserInviter = formData?.inviter_id === user.user_id;
  const isUserInvitee = formData?.invitee_id === user.user_id;

  const { data: isInviterSubscribed, isLoading: isInviterSubscriptionLoading } =
    useGetClubSubscriptionsByFilterQuery({
      player_id: formData?.inviter_id,
      is_active: true,
      club_id: selectedClub?.[0]?.user_id,
    });

  const { data: isInviteeSubscribed, isLoading: isInviteeSubscriptionLoading } =
    useGetClubSubscriptionsByFilterQuery({
      player_id: formData?.invitee_id,
      is_active: true,
      club_id: selectedClub?.[0]?.user_id,
    });

  const oppositionUser = isUserInviter
    ? users?.find((user) => user.user_id === formData?.invitee_id)
    : isUserInvitee &&
      users?.find((user) => user.user_id === formData?.inviter_id);

  const opposition =
    oppositionUser?.user_type_id === 1
      ? players?.find((player) => player.user_id === oppositionUser?.user_id)
      : oppositionUser?.user_type_id === 2 &&
        trainers?.find(
          (trainer) => trainer.user_id === oppositionUser?.user_id
        );

  const isEventTraining = formData?.event_type_id === 1;
  const isEventMatch = formData?.event_type_id === 2;
  const isEventLesson = formData?.event_type_id === 3;

  let lessonTrainerSubscribed = false;
  let lessonPlayerSubscribed = false;

  if (
    isEventLesson &&
    oppositionUser.user_type_id === 2 &&
    clubStaff?.find(
      (staff) =>
        staff.employment_status === "accepted" &&
        staff.user_id === oppositionUser?.user_id &&
        staff.club_id === formData?.club_id
    )
  ) {
    lessonTrainerSubscribed = true;
  }

  if (
    isEventLesson &&
    oppositionUser.user_type_id === 2 &&
    clubSubscriptions?.find(
      (subscription) =>
        subscription.club_id === selectedClub?.user_id &&
        subscription.is_active === true &&
        subscription.player_id === user?.user_id
    )
  ) {
    lessonPlayerSubscribed = true;
  }

  if (
    isEventLesson &&
    oppositionUser.user_type_id === 1 &&
    clubStaff?.find(
      (staff) =>
        staff.employment_status === "accepted" &&
        staff.user_id === user?.user_id &&
        staff.club_id === selectedClub?.club_id
    )
  ) {
    lessonTrainerSubscribed = true;
  }

  if (
    isEventLesson &&
    oppositionUser.user_type_id === 1 &&
    clubSubscriptions?.find(
      (subscription) =>
        subscription.club_id === selectedClub?.user_id &&
        subscription.is_active === true &&
        subscription.player_id === oppositionUser?.user_id
    )
  ) {
    lessonPlayerSubscribed = true;
  }
  if (
    isUsersLoading ||
    isPlayersLoading ||
    isTrainersLoading ||
    isSelectedClubLoading ||
    isCourtsLoading ||
    isClubSubscriptionsLoading ||
    isClubStaffLoading
  ) {
    return <PageLoading />;
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
                    : "/images/icons/avatar.png"
                }
                className={styles.img}
              />
            </td>
            <td>{`${opposition.fname} ${opposition.lname}`}</td>
            <td>{new Date(formData?.event_date).toLocaleDateString()}</td>
            <td>{formData?.event_time.slice(0, 5)}</td>
            <td>{selectedClub?.[0]?.club_name}</td>
            <td>{selectedCourt?.[0]?.court_name}</td>
            {/* kort ücreti */}
            {isUserPlayer && (
              <td>
                {(isEventTraining || isEventMatch) &&
                selectedClub?.[0]?.higher_price_for_non_subscribers &&
                selectedCourt?.[0]?.price_hour_non_subscriber &&
                (isInviterSubscribed?.length === 0 ||
                  isInviteeSubscribed?.length === 0)
                  ? selectedCourt?.[0]?.price_hour_non_subscriber / 2
                  : isEventLesson &&
                    selectedClub?.[0]?.higher_price_for_non_subscribers ===
                      true &&
                    selectedCourt?.[0]?.price_hour_non_subscriber &&
                    (!lessonPlayerSubscribed || !lessonTrainerSubscribed)
                  ? selectedCourt?.[0]?.price_hour_non_subscriber
                  : isEventLesson &&
                    selectedClub?.[0]?.higher_price_for_non_subscribers ===
                      true &&
                    selectedCourt?.[0]?.price_hour_non_subscriber &&
                    lessonPlayerSubscribed &&
                    lessonTrainerSubscribed
                  ? selectedCourt?.[0]?.price_hour
                  : selectedCourt?.[0]?.price_hour}
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
                      trainer.user_id === Number(formData?.inviter_id)
                  )?.price_hour}
                {isUserPlayer &&
                  isUserInviter &&
                  trainers?.find(
                    (trainer) =>
                      trainer.user_id === Number(formData?.invitee_id)
                  )?.price_hour}
              </td>
            )}
            {/* toplam ücret */}
            {isUserPlayer && isEventLesson && isUserInviter && (
              <td>
                {selectedClub?.[0]?.higher_price_for_non_subscribers &&
                selectedCourt?.[0]?.price_hour_non_subscriber &&
                (!lessonPlayerSubscribed || !lessonTrainerSubscribed)
                  ? selectedCourt?.[0]?.price_hour_non_subscriber +
                    trainers?.find(
                      (trainer) =>
                        trainer.user_id === Number(formData?.invitee_id)
                    ).price_hour
                  : selectedCourt?.[0]?.price_hour +
                    trainers?.find(
                      (trainer) =>
                        trainer.user_id === Number(formData?.invitee_id)
                    ).price_hour}
              </td>
            )}
            {isUserPlayer && isEventLesson && isUserInvitee && (
              <td>
                {selectedCourt?.[0]?.price_hour +
                  trainers?.find(
                    (trainer) =>
                      trainer.user_id === Number(formData?.inviter_id)
                  )?.price_hour}
              </td>
            )}
            {isUserPlayer && (isEventTraining || isEventMatch) && (
              <td>
                {selectedClub?.[0]?.higher_price_for_non_subscribers &&
                selectedCourt?.[0]?.price_hour_non_subscriber &&
                (isInviterSubscribed?.length === 0 ||
                  isInviteeSubscribed?.length === 0)
                  ? selectedCourt?.[0]?.price_hour_non_subscriber / 2
                  : selectedCourt?.[0]?.price_hour / 2}
              </td>
            )}
          </tr>
        </tbody>
      </table>
      {isUserPlayer &&
        (formData?.event_type_id === 1 || formData?.event_type_id === 2) && (
          <p className={styles["fee-text"]}>
            Kort ücreti oyuncular arasında yarı yarıya bölüşülür. Tahsil
            edilecek tutar Toplam Tutar'dır.
          </p>
        )}
      <button onClick={handleModalSubmit}>Davet gönder</button>
    </Modal>
  );
};

export default InviteModal;
