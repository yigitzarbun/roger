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
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import {
  useGetPaymentsQuery,
  useUpdatePaymentMutation,
} from "../../../../api/endpoints/PaymentsApi";

import {
  useGetStudentsQuery,
  useAddStudentMutation,
} from "../../../../api/endpoints/StudentsApi";

const TrainerRequestsIncoming = () => {
  const user = useAppSelector((store) => store?.user?.user?.user);

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetBookingsQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});
  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const {
    data: students,
    isLoading: isStudentsLoading,
    refetch: refetchStudents,
  } = useGetStudentsQuery({});

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: playerLevelTypes, isLoading: isPlayerLevelTypesLoading } =
    useGetPlayerLevelsQuery({});

  const {
    data: payments,
    isLoading: isPaymentsLoading,
    refetch: refetchPayments,
  } = useGetPaymentsQuery({});

  const date = new Date();
  const today = date.toLocaleDateString();
  const now = date.toLocaleTimeString();

  const incomingBookings = bookings?.filter(
    (booking) =>
      booking.invitee_id === user?.user_id &&
      booking.booking_status_type_id === 1 &&
      (new Date(booking.event_date).toLocaleDateString() > today ||
        (new Date(booking.event_date).toLocaleDateString() === today &&
          booking.event_time >= now))
  );

  const currentYear = new Date().getFullYear();

  const [updateBooking, { isSuccess: isUpdateBookingSuccess }] =
    useUpdateBookingMutation({});

  const [updatePayment, { data: paymentData, isSuccess: isPaymentSuccess }] =
    useUpdatePaymentMutation({});

  const [addStudent, { isSuccess: isAddStudentSuccess }] =
    useAddStudentMutation({});

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
      (payment) => payment.payment_id === acceptBookingData?.payment_id
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
    }
  }, [isPaymentSuccess]);

  useEffect(() => {
    if (isUpdateBookingSuccess) {
      // check if player is not student. add if not
      const selectedPlayerId = players?.find(
        (player) => player.user_id === acceptBookingData.inviter_id
      )
        ? acceptBookingData.inviter_id
        : acceptBookingData.invitee_id;

      const isStudent = students?.find(
        (student) =>
          student.player_id === selectedPlayerId &&
          student.trainer_id === user?.user_id &&
          (student.student_status === "pending" ||
            student.student_status === "accepted")
      );
      if (!isStudent) {
        const newStudent = {
          student_status: "pending",
          trainer_id: user?.user_id,
          player_id: selectedPlayerId,
        };
        addStudent(newStudent);
      }
    }
    refetchBookings();
    refetchPayments();
    setAcceptBookingData(null);
    handleCloseAcceptModal();
    handleCloseDeclineModal();
  }, [isUpdateBookingSuccess]);

  useEffect(() => {
    if (isAddStudentSuccess) {
      refetchStudents();
    }
  }, [isAddStudentSuccess]);

  if (
    isBookingsLoading ||
    isCourtsLoading ||
    isClubsLoading ||
    isEventTypesLoading ||
    isPlayersLoading ||
    isPlayerLevelTypesLoading ||
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
        <div>Gelen ders daveti bulunmamaktadır</div>
      ) : (
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
              <tr key={booking.booking_id} className={styles["trainer-row"]}>
                <td>
                  {booking.booking_status_type_id === 1 ? (
                    <p className={styles["pending-confirmation-text"]}>
                      Bekleniyor
                    </p>
                  ) : (
                    ""
                  )}
                </td>
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}1/${booking.inviter_id}`}>
                    <img
                      src={
                        players?.find(
                          (player) => player.user_id === booking.inviter_id
                        )?.image
                          ? players?.find(
                              (player) => player.user_id === booking.inviter_id
                            )?.image
                          : "/images/icons/avatar.png"
                      }
                      className={styles["player-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${booking.inviter_id}`}
                    className={styles["player-name"]}
                  >
                    {`${
                      players?.find(
                        (player) => player.user_id === booking.inviter_id
                      )?.fname
                    } ${
                      players?.find(
                        (player) => player.user_id === booking.inviter_id
                      )?.lname
                    }`}
                  </Link>
                </td>
                <td>
                  {
                    playerLevelTypes?.find(
                      (level) =>
                        level.player_level_id ===
                        players?.find(
                          (player) => player.user_id === booking.inviter_id
                        )?.player_level_id
                    )?.player_level_name
                  }
                </td>
                <td>
                  {
                    players?.find(
                      (player) => player.user_id === booking.inviter_id
                    )?.gender
                  }
                </td>
                <td>
                  {currentYear -
                    players?.find(
                      (player) => player.user_id === booking.inviter_id
                    )?.birth_year}
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
                    courts?.find((court) => court.court_id === booking.court_id)
                      ?.court_name
                  }
                </td>
                <td>
                  {
                    clubs?.find((club) => club.club_id === booking.club_id)
                      ?.club_name
                  }
                </td>
                <td>
                  {
                    payments?.find(
                      (payment) => payment.payment_id === booking.payment_id
                    )?.lesson_price
                  }
                </td>
                <td>
                  <button
                    onClick={() => handleOpenAcceptModal(booking)}
                    className={styles["accept-button"]}
                  >
                    Onay
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleOpenDeclineModal(booking)}
                    className={styles["decline-button"]}
                  >
                    Reddet
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default TrainerRequestsIncoming;
