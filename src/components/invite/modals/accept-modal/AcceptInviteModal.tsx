import React from "react";

import ReactModal from "react-modal";

import styles from "./styles.module.scss";

import { Player } from "../../../../api/endpoints/PlayersApi";
import { useGetUsersQuery } from "../../../../store/auth/apiSlice";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetClubByClubIdQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtByIdQuery } from "../../../../api/endpoints/CourtsApi";
import { useAppSelector } from "../../../../store/hooks";
import { useGetPaymentByIdQuery } from "../../../../api/endpoints/PaymentsApi";
import { useGetClubExternalMembersQuery } from "../../../../api/endpoints/ClubExternalMembersApi";
import { useGetStudentGroupsQuery } from "../../../../api/endpoints/StudentGroupsApi";
import PageLoading from "../../../../components/loading/PageLoading";

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
  handleAcceptBooking: () => void;
  acceptBookingData: AcceptBookingData;
  players: Player[];
}

const AcceptInviteModal = (props: AcceptInviteModalProps) => {
  const {
    isAcceptModalOpen,
    handleCloseAcceptModal,
    acceptBookingData,
    handleAcceptBooking,
    players,
  } = props;

  const user = useAppSelector((store) => store.user.user.user);

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: selectedClub, isLoading: isSelectedClubLoading } =
    useGetClubByClubIdQuery(acceptBookingData?.club_id);

  const { data: selectedCourt, isLoading: isSelectedCourtLoading } =
    useGetCourtByIdQuery(acceptBookingData?.court_id);

  const { data: selectedPayment, isLoading: isSelectedPaymentLoading } =
    useGetPaymentByIdQuery(acceptBookingData?.payment_id);

  const { data: externalMembers, isLoading: isExternalMembersLoading } =
    useGetClubExternalMembersQuery({});

  const { data: studentGroups, isLoading: isStudentGroupsLoading } =
    useGetStudentGroupsQuery({});

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
      : oppositionUser.user_type_id === 2
      ? trainers?.find((trainer) => trainer.user_id === oppositionUser.user_id)
      : oppositionUser.user_type_id === 5
      ? externalMembers?.find(
          (member) => member.user_id === oppositionUser.user_id
        )
      : oppositionUser.user_type_id === 6 &&
        studentGroups?.find(
          (group) => group.user_id === oppositionUser.user_id
        );

  const isEventTraining = acceptBookingData?.event_type_id === 1;
  const isEventMatch = acceptBookingData?.event_type_id === 2;
  const isEventLesson = acceptBookingData?.event_type_id === 3;

  if (
    isUsersLoading ||
    isTrainersLoading ||
    isSelectedPaymentLoading ||
    isExternalMembersLoading ||
    isStudentGroupsLoading ||
    isSelectedClubLoading ||
    isSelectedCourtLoading
  ) {
    return <PageLoading />;
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
              <img
                src={
                  opposition?.image
                    ? opposition?.image
                    : "/images/icons/avatar.png"
                }
                className={styles["player-image"]}
              />
            </td>
            <td>{`${opposition.fname} ${opposition.lname}`}</td>
            <td>
              {new Date(acceptBookingData?.event_date).toLocaleDateString()}
            </td>
            <td>{acceptBookingData?.event_time.slice(0, 5)}</td>
            <td>{selectedClub?.[0]?.club_name}</td>
            <td>{selectedCourt?.[0]?.court_name}</td>
            {isUserPlayer && <td>{selectedPayment?.[0]?.court_price}</td>}
            {isEventLesson && <td>{selectedPayment?.[0]?.lesson_price}</td>}
            {isUserPlayer && isEventLesson && (
              <td>{selectedPayment?.[0]?.payment_amount}</td>
            )}

            {((isUserPlayer && isEventTraining) ||
              (isUserPlayer && isEventMatch)) && (
              <td>{selectedPayment?.[0]?.payment_amount / 2}</td>
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
      {isUserPlayer &&
        (acceptBookingData?.event_type_id === 1 ||
          acceptBookingData?.event_type_id === 2) && (
          <p className={styles["fee-text"]}>
            Kort ücreti oyuncular arasında yarı yarıya bölüşülür. Tahsil
            edilecek tutar Toplam Tutar'dır.
          </p>
        )}
      <button onClick={handleAcceptBooking}>Onayla</button>
    </ReactModal>
  );
};
export default AcceptInviteModal;
