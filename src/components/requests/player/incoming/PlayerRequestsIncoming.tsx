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
import {
  useGetPaymentByIdQuery,
  useUpdatePaymentMutation,
} from "../../../../api/endpoints/PaymentsApi";
import {
  useAddMatchScoreMutation,
  useGetMatchScoresQuery,
} from "../../../../api/endpoints/MatchScoresApi";
import { getAge } from "../../../../common/util/TimeFunctions";
import { useTranslation } from "react-i18next";

const PlayerRequestsIncoming = () => {
  const { t } = useTranslation();

  const user = useAppSelector((store) => store?.user?.user?.user);

  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const [skipSelectedPayment, setSkipSelectedPayment] = useState(true);

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);

  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);

  const [declineBookingData, setDeclineBookingData] =
    useState<DeclineBookingData | null>(null);

  const [acceptBookingData, setAcceptBookingData] =
    useState<AcceptBookingData | null>(null);

  const {
    data: incomingBookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetPlayerIncomingRequestsQuery(user?.user_id);

  const { refetch: refetchMatchScores } = useGetMatchScoresQuery({});

  const [updateBooking, { isSuccess: isUpdateBookingSuccess }] =
    useUpdateBookingMutation({});

  const [updatePayment, { data: paymentData, isSuccess: isPaymentSuccess }] =
    useUpdatePaymentMutation({});

  const [addMatchScore, { isSuccess: isMatchScoreSuccess }] =
    useAddMatchScoreMutation({});

  const handleOpenAcceptModal = (data) => {
    setAcceptBookingData(data);
    setSelectedPaymentId(data.payment_id);
    setSkipSelectedPayment(false);
    setIsAcceptModalOpen(true);
  };

  const handleCloseAcceptModal = () => {
    setIsAcceptModalOpen(false);
  };

  const {
    data: selectedPayment,
    isLoading: isSelectedPaymentLoading,
    refetch: refetchPayments,
  } = useGetPaymentByIdQuery(selectedPaymentId, { skip: skipSelectedPayment });

  const handleAcceptBooking = () => {
    const updatedPaymentData = {
      ...selectedPayment?.[0],
      payment_status: "success",
    };
    updatePayment(updatedPaymentData);
  };

  const handleOpenDeclineModal = (data) => {
    setDeclineBookingData(data);
    setSelectedPaymentId(data.payment_id);
    setSkipSelectedPayment(false);
    setIsDeclineModalOpen(true);
  };

  const handleCloseDeclineModal = () => {
    setIsDeclineModalOpen(false);
  };

  const handleDeclineBooking = () => {
    const updatedPaymentData = {
      ...selectedPayment?.[0],
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
    // initiate matchScore
    if (
      isUpdateBookingSuccess &&
      paymentData &&
      paymentData[0]?.payment_status === "success" &&
      acceptBookingData?.event_type_id === 2
    ) {
      const matchScoreData = {
        match_score_status_type_id: 1,
        booking_id: acceptBookingData?.booking_id,
      };
      addMatchScore(matchScoreData);
    }
  }, [isUpdateBookingSuccess]);

  useEffect(() => {
    if (isMatchScoreSuccess) {
      refetchMatchScores();
    }
    if (isUpdateBookingSuccess) {
      refetchBookings();
      setAcceptBookingData(null);
      handleCloseAcceptModal();
      handleCloseDeclineModal();
    }
  }, [isMatchScoreSuccess, isUpdateBookingSuccess]);

  if (isBookingsLoading || isSelectedPaymentLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <h2 className={styles.title}>{t("incomingRequestsTitle")}</h2>
      </div>
      {incomingBookings?.length === 0 ? (
        <div>{t("playerIncomingRequestsEmptyText")}</div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>{t("tableOpponentHeader")}</th>
                <th>{t("tableNameHeader")}</th>
                <th>{t("tableLevelHeader")}</th>
                <th>{t("tableGenderHeader")}</th>
                <th>{t("tableAgeHeader")}</th>
                <th>{t("tableClubTypeHeader")} </th>
                <th>{t("tableDateHeader")}</th>
                <th>{t("tableTimeHeader")} </th>
                <th>{t("tableCourtHeader")}</th>
                <th>{t("leaderboardTableLocationHeader")}</th>
                <th>
                  {t("tablePriceHeader")}
                  <span className={styles["fee"]}>*</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {incomingBookings?.map((booking) => (
                <tr key={booking.booking_id} className={styles["player-row"]}>
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
                    {(booking.event_type_id === 1 ||
                      booking.event_type_id === 2 ||
                      booking.event_type_id === 7) &&
                    booking.player_level_id === 1
                      ? t("playerLevelBeginner")
                      : (booking.event_type_id === 1 ||
                          booking.event_type_id === 2 ||
                          booking.event_type_id === 7) &&
                        booking?.player_level_id === 2
                      ? t("playerLevelIntermediate")
                      : (booking.event_type_id === 1 ||
                          booking.event_type_id === 2 ||
                          booking.event_type_id === 7) &&
                        booking?.player_level_id === 3
                      ? t("playerLevelAdvanced")
                      : (booking.event_type_id === 1 ||
                          booking.event_type_id === 2 ||
                          booking.event_type_id === 7) &&
                        booking?.player_level_id === 4
                      ? t("playerLevelProfessinal")
                      : booking.event_type_id === 3 &&
                        booking?.trainer_experience_type_id === 1
                      ? t("trainerLevelBeginner")
                      : booking.event_type_id === 3 &&
                        booking?.trainer_experience_type_id === 2
                      ? t("trainerLevelIntermediate")
                      : booking.event_type_id === 3 &&
                        booking?.trainer_experience_type_id === 3
                      ? t("trainerLevelAdvanced")
                      : booking.event_type_id === 3 &&
                        booking?.trainer_experience_type_id === 4
                      ? t("trainerLevelProfessional")
                      : "-"}
                  </td>
                  <td>
                    {booking?.gender === "female" ? t("female") : t("male")}
                  </td>
                  <td>{getAge(booking?.birth_year)}</td>
                  <td>
                    {booking?.event_type_id === 1
                      ? t("training")
                      : booking?.event_type_id === 2
                      ? t("match")
                      : booking?.event_type_id === 3
                      ? t("lesson")
                      : booking?.event_type_id === 4
                      ? t("externalTraining")
                      : booking?.event_type_id === 5
                      ? t("externalLesson")
                      : booking?.event_type_id === 6
                      ? t("groupLesson")
                      : booking?.event_type_id === 7
                      ? t("tournamentMatch")
                      : ""}
                  </td>
                  <td>{new Date(booking.event_date).toLocaleDateString()}</td>
                  <td>{booking.event_time.slice(0, 5)}</td>
                  <td>{booking?.court_name}</td>
                  <td>{booking?.club_name}</td>
                  <td>
                    {booking.event_type_id === 1 || booking.event_type_id === 2
                      ? booking?.payment_amount / 2
                      : booking.event_type_id === 3
                      ? booking?.lesson_price + booking?.court_price
                      : "External Booking"}
                  </td>
                  <td>
                    <button
                      onClick={() => handleOpenDeclineModal(booking)}
                      className={styles["decline-button"]}
                    >
                      {t("reject")}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleOpenAcceptModal(booking)}
                      className={styles["accept-button"]}
                    >
                      {t("approve")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles["fee-text"]}>(*) {t("playerFeeText")}</p>
        </>
      )}
      {isAcceptModalOpen && (
        <AcceptInviteModal
          isAcceptModalOpen={isAcceptModalOpen}
          handleCloseAcceptModal={handleCloseAcceptModal}
          acceptBookingData={acceptBookingData}
          handleAcceptBooking={handleAcceptBooking}
          user={user}
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
