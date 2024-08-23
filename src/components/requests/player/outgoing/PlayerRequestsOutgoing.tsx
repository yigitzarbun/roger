import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Paths from "../../../../routing/Paths";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../../store/hooks";
import CancelInviteModal, {
  BookingData,
} from "../../../invite/modals/cancel-modal/CancelInviteModal";
import PageLoading from "../../../../components/loading/PageLoading";
import { useGetPlayerOutgoingRequestsQuery } from "../../../../api/endpoints/BookingsApi";
import { useUpdateBookingMutation } from "../../../../api/endpoints/BookingsApi";
import { getAge } from "../../../../common/util/TimeFunctions";
import { BsClockHistory } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const PlayerRequestsOutgoing = () => {
  const user = useAppSelector((store) => store?.user?.user?.user);

  const { t } = useTranslation();

  const {
    data: outgoingBookings,
    isLoading: isBookingsLoading,
    refetch,
  } = useGetPlayerOutgoingRequestsQuery(user?.user_id);

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
      handleCloseModal();
    }
  }, [isSuccess]);

  if (isBookingsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <h2 className={styles.title}>{t("outgoingRequestsTitle")}</h2>
      </div>
      {outgoingBookings?.length === 0 ? (
        <div>{t("playerOutgoingRequestsEmptyText")}</div>
      ) : (
        <>
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
                <th>{t("leaderboardTableLocationHeader")}</th>
                <th>{t("tableCourtHeader")}</th>
                <th>
                  {t("tablePriceHeader")}
                  <span className={styles["fee"]}>*</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {outgoingBookings?.map((booking) => (
                <tr key={booking.booking_id} className={styles["player-row"]}>
                  <td className={styles["pending-confirmation-text"]}>
                    {booking.booking_status_type_id === 1 ? (
                      <BsClockHistory
                        className={styles["pending-confirmation-text"]}
                      />
                    ) : (
                      ""
                    )}
                  </td>
                  <td>
                    <Link
                      to={`${Paths.EXPLORE_PROFILE}${
                        booking?.user_type_id === 1
                          ? 1
                          : booking?.user_type_id === 2
                          ? 2
                          : ""
                      }/${booking.invitee_id}`}
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
                        to={`${Paths.EXPLORE_PROFILE}1/${booking.invitee_id}`}
                        className={styles["player-name"]}
                      >
                        {`${booking?.fname}
                        ${booking?.lname}
                        `}
                      </Link>
                    ) : booking.event_type_id === 3 ? (
                      <Link
                        to={`${Paths.EXPLORE_PROFILE}2/${booking.invitee_id}`}
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
                  <td>{booking?.club_name}</td>
                  <td>{booking?.court_name}</td>
                  <td>
                    {booking.event_type_id === 1 || booking.event_type_id === 2
                      ? booking?.payment_amount / 2
                      : booking.event_type_id === 3
                      ? booking?.court_price + booking.lesson_price
                      : "External Booking"}
                  </td>
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
          <p className={styles["fee-text"]}>(*) {t("playerFeeText")}</p>
        </>
      )}
      <CancelInviteModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        bookingData={bookingData}
        handleCancelBooking={handleCancelBooking}
        user={user}
      />
    </div>
  );
};

export default PlayerRequestsOutgoing;
