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
import { useGetClubExternalMembersQuery } from "../../../../api/endpoints/ClubExternalMembersApi";
import { useGetStudentGroupsQuery } from "../../../../api/endpoints/StudentGroupsApi";

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
  payment_id: number;
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

  const { data: selectedClub, isLoading: isSelectedClubLoading } =
    useGetClubByClubIdQuery(Number(bookingData?.club_id), {
      skip: !isModalOpen,
    });

  const { data: selectedCourt, isLoading: isSelectedCourtLoading } =
    useGetCourtByIdQuery(Number(bookingData?.court_id), { skip: !isModalOpen });

  const { data: selectedPayment, isLoading: isSelectedPaymentLoading } =
    useGetPaymentByIdQuery(Number(bookingData?.payment_id), {
      skip: !isModalOpen,
    });

  const { data: externalMembers, isLoading: isExternalMembersLoading } =
    useGetClubExternalMembersQuery({});

  const { data: studentGroups, isLoading: isStudentGroupsLoading } =
    useGetStudentGroupsQuery({});

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

  const isEventTraining = bookingData?.event_type_id === 1;
  const isEventMatch = bookingData?.event_type_id === 2;
  const isEventLesson =
    bookingData?.event_type_id === 3 ||
    bookingData?.event_type_id === 5 ||
    bookingData?.event_type_id === 6;

  if (
    isUsersLoading ||
    isPlayersLoading ||
    isTrainersLoading ||
    isExternalMembersLoading ||
    isStudentGroupsLoading ||
    isSelectedPaymentLoading ||
    isSelectedCourtLoading ||
    isSelectedClubLoading
  ) {
    return <PageLoading />;
  }
  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={handleCloseModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>
          {isEventLesson
            ? "Ders İptal"
            : isEventMatch
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
                  bookingData?.event_type_id === 5 && selectedClub?.[0]?.image
                    ? selectedClub?.[0]?.image
                    : opposition?.image
                    ? opposition?.image
                    : "images/icons/avatar.png"
                }
                className={styles.img}
              />
            </td>
            <td>
              {oppositionUser?.user_type_id === 6
                ? opposition.student_group_name
                : `${opposition.fname} ${opposition.lname}`}
            </td>
            <td>{new Date(bookingData?.event_date).toLocaleDateString()}</td>
            <td>{bookingData?.event_time.slice(0, 5)}</td>
            <td>{selectedClub?.[0]?.club_name}</td>
            <td>{selectedCourt?.[0]?.court_name}</td>
            {/* kort ücreti */}
            {isUserPlayer && <td>{selectedPayment?.[0]?.court_price}</td>}

            {/* ders ücreti */}
            {isEventLesson && (
              <td>
                {selectedPayment?.[0]?.lesson_price
                  ? selectedPayment?.[0]?.lesson_price
                  : "-"}
              </td>
            )}
            {/* toplam ücret */}
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
      {isUserPlayer &&
        (bookingData?.event_type_id === 1 ||
          bookingData?.event_type_id === 2) && (
          <p className={styles["fee-text"]}>
            Kort ücreti oyuncular arasında yarı yarıya bölüşülür. Tahsil
            edilecek tutar Toplam Tutar'dır.
          </p>
        )}
      <button onClick={handleCancelBooking}>Onayla</button>
    </ReactModal>
  );
};
export default CancelInviteModal;
