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
  useGetPlayerIncomingRequestsQuery,
  useUpdateBookingMutation,
} from "../../../../api/endpoints/BookingsApi";
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
import { getAge } from "../../../../common/util/TimeFunctions";

const PlayerRequestsIncoming = () => {
  const user = useAppSelector((store) => store?.user?.user?.user);

  const {
    data: incomingBookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetPlayerIncomingRequestsQuery(user?.user_id);

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

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
          booking_id: acceptBookingData?.booking_id,
          event_date: acceptBookingData?.event_date,
          event_time: acceptBookingData?.event_time,
          court_price: acceptBookingData?.court_price,
          lesson_price: acceptBookingData?.lesson_price,
          payment_id: acceptBookingData?.payment_id,
          event_type_id: acceptBookingData?.event_type_id,
          club_id: acceptBookingData?.club_id,
          court_id: acceptBookingData?.court_id,
          inviter_id: acceptBookingData?.inviter_id,
          invitee_id: acceptBookingData?.invitee_id,
          invitation_note: acceptBookingData?.invitation_note,
          booking_status_type_id: 2,
        };
        updateBooking(acceptedBookingData);
      } else if (paymentData[0]?.payment_status === "declined") {
        const declinedBookingData = {
          booking_id: declineBookingData?.booking_id,
          event_date: declineBookingData?.event_date,
          event_time: declineBookingData?.event_time,
          court_price: declineBookingData?.court_price,
          lesson_price: declineBookingData?.lesson_price,
          payment_id: declineBookingData?.payment_id,
          event_type_id: declineBookingData?.event_type_id,
          club_id: declineBookingData?.club_id,
          court_id: declineBookingData?.court_id,
          inviter_id: declineBookingData?.inviter_id,
          invitee_id: declineBookingData?.invitee_id,
          invitation_note: declineBookingData?.invitation_note,
          booking_status_type_id: 3,
        };
        updateBooking(declinedBookingData);
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
    isTrainersLoading ||
    isPlayersLoading ||
    isPaymentsLoading ||
    isStudentsLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <h2 className={styles.title}>Gelen Davetler</h2>
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
                <tr key={booking.booking_id} className={styles["player-row"]}>
                  <td className={styles["pending-confirmation-text"]}>
                    {booking.booking_status_type_id === 1 ? "Bekleniyor" : ""}
                  </td>
                  <td>
                    <Link
                      to={`${paths.EXPLORE_PROFILE}${
                        booking?.user_type_id === 1
                          ? 1
                          : booking?.user_type_id === 2
                          ? 2
                          : ""
                      }/${booking.inviter_id}`}
                    >
                      <img
                        src={
                          booking?.trainerImage
                            ? booking?.trainerImage
                            : booking?.playerImage
                            ? booking?.playerImage
                            : "/images/icons/avatar.jpg"
                        }
                        className={styles["player-image"]}
                      />
                    </Link>
                  </td>
                  <td>
                    {booking.event_type_id === 1 ||
                    booking.event_type_id === 2 ? (
                      <Link
                        to={`${paths.EXPLORE_PROFILE}1/${booking.inviter_id}`}
                        className={styles["player-name"]}
                      >
                        {`${booking?.fname}
                        ${booking?.lname}
                        `}
                      </Link>
                    ) : booking.event_type_id === 3 ? (
                      <Link
                        to={`${paths.EXPLORE_PROFILE}2/${booking.inviter_id}`}
                        className={styles["player-name"]}
                      >
                        {`${booking?.fname}
                        ${booking?.lname}
                        `}
                      </Link>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>
                    {booking.event_type_id === 1 || booking.event_type_id === 2
                      ? booking?.player_level_name
                      : booking.event_type_id === 3
                      ? booking?.trainer_experience_type_name
                      : ""}
                  </td>
                  <td>{booking?.gender}</td>
                  <td>{getAge(booking?.birth_year)}</td>
                  <td>{booking?.event_type_name}</td>
                  <td>{new Date(booking.event_date).toLocaleDateString()}</td>
                  <td>{booking.event_time.slice(0, 5)}</td>
                  <td>{booking?.court_name}</td>
                  <td>{booking?.club_name}</td>
                  <td>
                    {booking.event_type_id === 1 || booking.event_type_id === 2
                      ? booking?.payment_amount / 2
                      : booking.event_type_id === 3
                      ? booking?.payment_amount
                      : "External Booking"}
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
      {isAcceptModalOpen && (
        <AcceptInviteModal
          isAcceptModalOpen={isAcceptModalOpen}
          handleCloseAcceptModal={handleCloseAcceptModal}
          acceptBookingData={acceptBookingData}
          handleAcceptBooking={handleAcceptBooking}
          players={players}
        />
      )}
      {isDeclineModalOpen && (
        <DeclineInviteModal
          isDeclineModalOpen={isDeclineModalOpen}
          handleCloseDeclineModal={handleCloseDeclineModal}
          declineBookingData={declineBookingData}
          handleDeclineBooking={handleDeclineBooking}
          user={user}
        />
      )}
    </div>
  );
};

export default PlayerRequestsIncoming;
