import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import AcceptInviteModal, {
  AcceptBookingData,
} from "../../../invite/modals/accept-modal/AcceptInviteModal";

import DeclineInviteModal, {
  DeclineBookingData,
} from "../../../invite/modals/decline-modal/DeclineInviteModal";

import PageLoading from "../../../../components/loading/PageLoading";

import {
  useGetBookingsQuery,
  useUpdateBookingMutation,
} from "../../../../api/endpoints/BookingsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import {
  useGetPaymentsQuery,
  useUpdatePaymentMutation,
} from "../../../../api/endpoints/PaymentsApi";
import {
  useAddMatchScoreMutation,
  useGetMatchScoresQuery,
} from "../../../../api/endpoints/MatchScoresApi";
import {
  useAddStudentMutation,
  useGetStudentsQuery,
} from "../../../../api/endpoints/StudentsApi";

import { useGetUsersQuery } from "../../../../store/auth/apiSlice";

const PlayerRequestsIncoming = () => {
  const user = useAppSelector((store) => store?.user?.user?.user);

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetBookingsQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: playerLevelTypes, isLoading: isPlayerLevelTypesLoading } =
    useGetPlayerLevelsQuery({});

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});

  const { refetch: refetchMatchScores } = useGetMatchScoresQuery({});

  const {
    data: payments,
    isLoading: isPaymentsLoading,
    refetch: refetchPayments,
  } = useGetPaymentsQuery({});

  const {
    data: students,
    isLoading: isStudentsLoading,
    refetch: refetchStudents,
  } = useGetStudentsQuery({});

  const [addStudent, { isSuccess: isAddStudentSuccess }] =
    useAddStudentMutation({});

  const [updateBooking, { isSuccess: isUpdateBookingSuccess }] =
    useUpdateBookingMutation({});

  const [updatePayment, { data: paymentData, isSuccess: isPaymentSuccess }] =
    useUpdatePaymentMutation({});

  const [addMatchScore, { isSuccess: isMatchScoreSuccess }] =
    useAddMatchScoreMutation({});

  const date = new Date();
  const today = date.toLocaleDateString();
  const now = date.toLocaleTimeString();
  const currentYear = new Date().getFullYear();

  const incomingBookings = bookings?.filter(
    (booking) =>
      booking.invitee_id === user?.user_id &&
      booking.booking_status_type_id === 1 &&
      (new Date(booking.event_date).toLocaleDateString() > today ||
        (new Date(booking.event_date).toLocaleDateString() === today &&
          booking.event_time >= now))
  );

  // accept booking
  const [acceptBookingData, setAcceptBookingData] =
    useState<AcceptBookingData | null>(null);

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);

  const handleOpenAcceptModal = (data) => {
    setAcceptBookingData(data);
    setIsAcceptModalOpen(true);
  };

  const handleCloseAcceptModal = () => {
    setIsAcceptModalOpen(false);
  };

  const handleAcceptBooking = () => {
    const selectedPayment = payments?.find(
      (payment) => payment.payment_id === acceptBookingData?.payment_id
    );
    const updatedPaymentData = {
      ...selectedPayment,
      payment_status: "success",
    };
    updatePayment(updatedPaymentData);
  };

  // decline booking
  const [declineBookingData, setDeclineBookingData] =
    useState<DeclineBookingData | null>(null);

  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);

  const handleOpenDeclineModal = (data) => {
    setDeclineBookingData(data);
    setIsDeclineModalOpen(true);
  };

  const handleCloseDeclineModal = () => {
    setIsDeclineModalOpen(false);
  };

  const handleDeclineBooking = () => {
    const selectedPayment = payments?.find(
      (payment) => payment.payment_id === declineBookingData?.payment_id
    );
    const updatedPaymentData = {
      ...selectedPayment,
      payment_status: "declined",
    };
    updatePayment(updatedPaymentData);
  };

  useEffect(() => {
    if (isPaymentSuccess && paymentData) {
      if (paymentData[0]?.payment_status === "success") {
        const acceptedBookingData = {
          ...acceptBookingData,
          booking_status_type_id: 2,
        };
        updateBooking(acceptedBookingData);
      } else if (paymentData[0]?.payment_status === "declined") {
        const declineddBookingData = {
          ...declineBookingData,
          booking_status_type_id: 3,
        };
        updateBooking(declineddBookingData);
      }

      refetchPayments();
    }
  }, [isPaymentSuccess]);

  useEffect(() => {
    if (
      isUpdateBookingSuccess &&
      paymentData &&
      paymentData[0]?.payment_status === "success"
    ) {
      const matchScoreData = {
        match_score_status_type_id: 1,
        booking_id: acceptBookingData?.booking_id,
      };
      addMatchScore(matchScoreData);
    }

    const selectedTrainerId = trainers?.find(
      (trainer) => trainer.user_id === acceptBookingData?.inviter_id
    )
      ? acceptBookingData?.inviter_id
      : acceptBookingData?.invitee_id;

    const isEventLesson = acceptBookingData?.event_type_id === 3;

    const isStudent = students?.find(
      (student) =>
        student.player_id === user?.user_id &&
        student.trainer_id === selectedTrainerId &&
        (student.student_status === "pending" ||
          student.student_status === "accepted")
    );

    if (isEventLesson && !isStudent) {
      const newStudent = {
        student_status: "pending",
        trainer_id: selectedTrainerId,
        player_id: user?.user_id,
      };
      addStudent(newStudent);
    }
  }, [isUpdateBookingSuccess]);

  useEffect(() => {
    if (isMatchScoreSuccess) {
      refetchMatchScores();
    }
    if (isUpdateBookingSuccess) {
      refetchBookings();
      refetchStudents();
      setAcceptBookingData(null);
      handleCloseAcceptModal();
      handleCloseDeclineModal();
    }
  }, [isMatchScoreSuccess, isUpdateBookingSuccess]);

  if (
    isBookingsLoading ||
    isCourtsLoading ||
    isClubsLoading ||
    isTrainersLoading ||
    isEventTypesLoading ||
    isPlayersLoading ||
    isPlayerLevelTypesLoading ||
    isTrainerExperienceTypesLoading ||
    isPaymentsLoading ||
    isStudentsLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Gelen Davetler</h2>
      </div>
      {incomingBookings?.length === 0 ? (
        <div>Gelen antreman, maç veya ders daveti bulunmamaktadır</div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Durum</th>
                <th>Oyuncu</th>
                <th>İsim</th>
                <th>Seviye</th>
                <th>Cinsiyet</th>
                <th>Yaş</th>
                <th>Tür</th>
                <th>Tarih</th>
                <th>Saat </th>
                <th>Kort</th>
                <th>Konum</th>
                <th>
                  Ücret<span className={styles["fee"]}>*</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {incomingBookings?.map((booking) => (
                <tr key={booking.booking_id}>
                  <td className={styles["pending-confirmation-text"]}>
                    {booking.booking_status_type_id === 1 ? "Bekleniyor" : ""}
                  </td>
                  <td className={styles["vertical-center"]}>
                    <Link
                      to={`${paths.EXPLORE_PROFILE}${
                        booking.event_type_id === 1 ||
                        booking.event_type_id === 2
                          ? 1
                          : booking.event_type_id === 3
                          ? 2
                          : ""
                      }/${booking.inviter_id}`}
                    >
                      <img
                        src={
                          (booking.event_type_id === 1 ||
                            booking.event_type_id === 2) &&
                          players?.find(
                            (player) => player.user_id === booking.inviter_id
                          )
                            ? players?.find(
                                (player) =>
                                  player.user_id === booking.inviter_id
                              )?.image
                            : booking.event_type_id === 3 &&
                              trainers?.find(
                                (trainer) =>
                                  trainer.user_id === booking.inviter_id
                              )?.image
                            ? trainers?.find(
                                (trainer) =>
                                  trainer.user_id === booking.inviter_id
                              )?.image
                            : "/images/icons/avatar.png"
                        }
                        className={styles["player-image"]}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`${paths.EXPLORE_PROFILE}${
                        booking.event_type_id === 1 ||
                        booking.event_type_id === 2
                          ? 1
                          : booking.event_type_id === 3
                          ? 2
                          : ""
                      }/${booking.inviter_id}`}
                      className={styles["inviter-name"]}
                    >
                      {(booking.event_type_id === 1 ||
                        booking.event_type_id === 2) &&
                      booking.invitee_id === user?.user_id
                        ? `${
                            players?.find(
                              (player) => player.user_id === booking.inviter_id
                            )?.fname
                          } ${
                            players?.find(
                              (player) => player.user_id === booking.inviter_id
                            )?.lname
                          }`
                        : ""}
                      {booking.event_type_id === 3 &&
                      booking.invitee_id === user?.user_id
                        ? `${
                            trainers?.find(
                              (trainer) =>
                                trainer.user_id === booking.inviter_id
                            )?.fname
                          } ${
                            trainers?.find(
                              (trainer) =>
                                trainer.user_id === booking.inviter_id
                            )?.lname
                          }`
                        : ""}
                    </Link>
                  </td>
                  <td>
                    {(booking.event_type_id === 1 ||
                      booking.event_type_id === 2) &&
                    booking.invitee_id === user?.user_id
                      ? playerLevelTypes?.find(
                          (level) =>
                            level.player_level_id ===
                            players?.find(
                              (player) => player.user_id === booking.inviter_id
                            )?.player_level_id
                        )?.player_level_name
                      : ""}

                    {booking.event_type_id === 3 &&
                    booking.invitee_id === user?.user_id
                      ? trainerExperienceTypes?.find(
                          (type) =>
                            type.trainer_experience_type_id ===
                            trainers?.find(
                              (trainer) =>
                                trainer.user_id === booking.inviter_id
                            )?.trainer_experience_type_id
                        )?.trainer_experience_type_name
                      : ""}
                  </td>
                  <td>
                    {(booking.event_type_id === 1 ||
                      booking.event_type_id === 2) &&
                    booking.invitee_id === user?.user_id
                      ? players?.find(
                          (player) => player.user_id === booking.inviter_id
                        )?.gender
                      : ""}
                    {booking.event_type_id === 3 &&
                    booking.invitee_id === user?.user_id
                      ? trainers?.find(
                          (trainer) => trainer.user_id === booking.inviter_id
                        )?.gender
                      : ""}
                  </td>
                  <td>
                    {(booking.event_type_id === 1 ||
                      booking.event_type_id === 2) &&
                    booking.invitee_id === user?.user_id
                      ? currentYear -
                        players?.find(
                          (player) => player.user_id === booking.inviter_id
                        )?.birth_year
                      : ""}
                    {booking.event_type_id === 3 &&
                    booking.invitee_id === user?.user_id
                      ? currentYear -
                        trainers?.find(
                          (trainer) => trainer.user_id === booking.inviter_id
                        )?.birth_year
                      : ""}
                  </td>
                  <td>
                    {
                      eventTypes?.find(
                        (type) => type.event_type_id === booking.event_type_id
                      )?.event_type_name
                    }
                  </td>
                  <td>{new Date(booking.event_date).toLocaleDateString()}</td>
                  <td>{booking.event_time.slice(0, 5)}</td>
                  <td>
                    {
                      courts?.find(
                        (court) => court.court_id === booking.court_id
                      )?.court_name
                    }
                  </td>
                  <td>
                    {
                      clubs?.find((club) => club.club_id === booking.club_id)
                        ?.club_name
                    }
                  </td>
                  <td>
                    {(booking.event_type_id === 1 ||
                      booking.event_type_id === 2) &&
                      payments?.find(
                        (payment) => booking.payment_id === payment.payment_id
                      )?.payment_amount / 2}
                    {booking.event_type_id === 3 &&
                      payments?.find(
                        (payment) => payment.payment_id === booking.payment_id
                      )?.payment_amount}
                  </td>
                  <td>
                    <button
                      onClick={() => handleOpenDeclineModal(booking)}
                      className={styles["decline-button"]}
                    >
                      Reddet
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleOpenAcceptModal(booking)}
                      className={styles["accept-button"]}
                    >
                      Onayla
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles["fee-text"]}>
            (*) Kort ücreti ve diğer tüm masraflar dahil ödeyeceğin tutar.
          </p>
        </>
      )}
      <AcceptInviteModal
        isAcceptModalOpen={isAcceptModalOpen}
        handleCloseAcceptModal={handleCloseAcceptModal}
        acceptBookingData={acceptBookingData}
        handleAcceptBooking={handleAcceptBooking}
      />
      <DeclineInviteModal
        isDeclineModalOpen={isDeclineModalOpen}
        handleCloseDeclineModal={handleCloseDeclineModal}
        declineBookingData={declineBookingData}
        handleDeclineBooking={handleDeclineBooking}
      />
    </div>
  );
};

export default PlayerRequestsIncoming;
