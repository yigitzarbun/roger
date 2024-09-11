import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import paths from "../../../../routing/Paths";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../../store/hooks";
import { useGetTrainerOutgoingRequestsQuery } from "../../../../api/endpoints/BookingsApi";
import { useUpdateBookingMutation } from "../../../../api/endpoints/BookingsApi";
import CancelInviteModal, {
  BookingData,
} from "../../../invite/modals/cancel-modal/CancelInviteModal";
import PageLoading from "../../../../components/loading/PageLoading";
import { getAge } from "../../../../common/util/TimeFunctions";
import { BsClockHistory } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const TrainerRequestsOutgoing = () => {
  const { user } = useAppSelector((store) => store.user?.user);

  const { t } = useTranslation();

  const {
    data: outgoingBookings,
    isLoading: isOutgoingBookingsLoading,
    refetch,
  } = useGetTrainerOutgoingRequestsQuery(user?.user_id);

  const [updateBooking, { isSuccess }] = useUpdateBookingMutation({});

  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (data) => {
    setBookingData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCancelBooking = () => {
    const cancelledBookingData = {
      booking_id: bookingData?.booking_id,
      registered_at: bookingData?.registered_at,
      event_date: bookingData?.event_date,
      event_time: bookingData?.event_time,
      court_price: bookingData?.court_price,
      lesson_price: bookingData?.lesson_price,
      payment_id: bookingData?.payment_id,
      event_type_id: bookingData?.event_type_id,
      club_id: bookingData?.club_id,
      court_id: bookingData?.court_id,
      inviter_id: bookingData?.inviter_id,
      invitee_id: bookingData?.invitee_id,
      invitation_note: bookingData?.invitation_note,
      booking_status_type_id: 4,
    };
    updateBooking(cancelledBookingData);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Davet iptal edildi");
      handleCloseModal();
    }
  }, [isSuccess]);

  if (isOutgoingBookingsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>{t("outgoingRequestsTitle")}</h2>
      </div>
      {outgoingBookings?.length === 0 ? (
        <div>{t("noLessonInvitationText")}</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{t("tableStatusHeader")}</th>
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
              <th>{t("tablePriceHeader")}</th>
            </tr>
          </thead>
          <tbody>
            {outgoingBookings?.map((booking) => (
              <tr key={booking.booking_id} className={styles["player-row"]}>
                <td className={styles["pending-text"]}>
                  {booking.booking_status_type_id === 1 ? (
                    <BsClockHistory
                      className={styles["pending-confirmation-text"]}
                    />
                  ) : (
                    ""
                  )}
                </td>
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}1/${booking.invitee_id}`}>
                    <img
                      src={
                        booking?.playerImage
                          ? booking?.playerImage
                          : "/images/icons/avatar.jpg"
                      }
                      className={styles["player-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${booking.invitee_id}`}
                    className={styles["player-name"]}
                  >
                    {`${booking?.fname} ${booking?.lname}`}
                  </Link>
                </td>
                <td>
                  {(booking.event_type_id === 3 ||
                    booking.event_type_id === 5) &&
                  booking.player_level_id === 1
                    ? t("playerLevelBeginner")
                    : (booking.event_type_id === 3 ||
                        booking.event_type_id === 5) &&
                      booking?.player_level_id === 2
                    ? t("playerLevelIntermediate")
                    : (booking.event_type_id === 3 ||
                        booking.event_type_id === 5) &&
                      booking?.player_level_id === 3
                    ? t("playerLevelAdvanced")
                    : (booking.event_type_id === 3 ||
                        booking.event_type_id === 5) &&
                      booking?.player_level_id === 4
                    ? t("playerLevelProfessinal")
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
                <td>{booking?.lesson_price}</td>
                <td>
                  <button
                    onClick={() => handleOpenModal(booking)}
                    className={styles["cancel-button"]}
                  >
                    {t("cancel")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isModalOpen && (
        <CancelInviteModal
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          bookingData={bookingData}
          handleCancelBooking={handleCancelBooking}
          user={user}
        />
      )}
    </div>
  );
};

export default TrainerRequestsOutgoing;
