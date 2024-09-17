import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import paths from "../../../../routing/Paths";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../../store/hooks";
import { IoIosCheckmarkCircle } from "react-icons/io";
import CancelInviteModal from "../../../invite/modals/cancel-modal/CancelInviteModal";
import { BookingData } from "../../../invite/modals/cancel-modal/CancelInviteModal";
import PageLoading from "../../../../components/loading/PageLoading";
import { useGetPlayerCalendarBookingsByFilterQuery } from "../../../../../api/endpoints/BookingsApi";
import { useUpdateBookingMutation } from "../../../../../api/endpoints/BookingsApi";
import { getAge } from "../../../../common/util/TimeFunctions";
import { FaFilter } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

interface PlayerCalendarResultsProps {
  date: string;
  eventTypeId: number;
  clubId: number;
  textSearch: string;
  handleOpenFilter: () => void;
}

const PlayerCalendarResults = (props: PlayerCalendarResultsProps) => {
  const { date, eventTypeId, clubId, textSearch, handleOpenFilter } = props;

  const { t } = useTranslation();

  const user = useAppSelector((store) => store?.user?.user?.user);

  const formattedDate = date ? date.split("/").reverse().join("-") : "";

  const {
    data: filteredBookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetPlayerCalendarBookingsByFilterQuery({
    date: formattedDate,
    eventTypeId: eventTypeId,
    clubId: clubId,
    userId: user?.user_id,
    textSearch: textSearch,
  });

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
      invitation_note: bookingData?.invitation_note,
      payment_id: bookingData?.payment_id,
      booking_status_type_id: 4,
      event_type_id: bookingData?.event_type_id,
      club_id: bookingData?.club_id,
      court_id: bookingData?.court_id,
      inviter_id: bookingData?.inviter_id,
      invitee_id: bookingData?.invitee_id,
    };
    updateBooking(cancelledBookingData);
  };

  useEffect(() => {
    if (isSuccess) {
      refetchBookings();
      handleCloseModal();
    }
  }, [isSuccess]);

  useEffect(() => {
    refetchBookings();
  }, [date, eventTypeId, clubId, textSearch]);

  if (isBookingsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <div className={styles["title-left"]}>
          <h2 className={styles.title}>{t("calendarTitle")}</h2>
          <FaFilter
            onClick={handleOpenFilter}
            className={
              clubId > 0 ||
              eventTypeId > 0 ||
              textSearch !== "" ||
              clubId > 0 ||
              date !== ""
                ? styles["active-filter"]
                : styles.filter
            }
          />
        </div>
      </div>
      {filteredBookings?.length === 0 ? (
        <div>{t("calendarEmptyText")}</div>
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
            {filteredBookings?.map((booking) => (
              <tr key={booking?.booking_id} className={styles["player-row"]}>
                <td>
                  <p className={styles["co"]}>
                    {booking.booking_status_type_id === 2 ? (
                      <IoIosCheckmarkCircle className={styles.done} />
                    ) : (
                      ""
                    )}
                  </p>
                </td>
                <td className={styles["vertical-center"]}>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${
                      booking.event_type_id === 1 ||
                      booking.event_type_id === 2 ||
                      booking.event_type_id === 7
                        ? 1
                        : booking.event_type_id === 3
                        ? 2
                        : booking.event_type_id === 6
                        ? 3
                        : ""
                    }/${
                      booking.event_type_id === 6
                        ? booking.clubUserId
                        : booking.user_id
                    }`}
                  >
                    <img
                      src={
                        booking.event_type_id === 6 && booking?.clubImage
                          ? booking?.clubImage
                          : (booking.event_type_id === 1 ||
                              booking.event_type_id === 2 ||
                              booking.event_type_id === 7) &&
                            booking.playerImage
                          ? booking.playerImage
                          : booking.event_type_id === 3 && booking.trainerImage
                          ? booking.trainerImage
                          : "/images/icons/avatar.jpg"
                      }
                      className={styles["player-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${
                      booking.event_type_id === 1 ||
                      booking.event_type_id === 2 ||
                      booking.event_type_id === 7
                        ? 1
                        : booking.event_type_id === 3
                        ? 2
                        : booking.event_type_id === 6
                        ? 3
                        : ""
                    }/${
                      booking.event_type_id === 6
                        ? booking.clubUserId
                        : booking.user_id
                    }`}
                    className={styles["player-name"]}
                  >
                    {booking.event_type_id === 1 ||
                    booking.event_type_id === 2 ||
                    booking.event_type_id === 3 ||
                    booking.event_type_id === 7
                      ? `${booking.fname} ${booking.lname}`
                      : booking.event_type_id === 6
                      ? booking?.student_group_name
                      : "-"}
                  </Link>
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
                  {(booking.event_type_id === 1 ||
                    booking.event_type_id === 2 ||
                    booking.event_type_id === 3 ||
                    booking.event_type_id === 7) &&
                  booking?.gender === "male"
                    ? t("male")
                    : (booking.event_type_id === 1 ||
                        booking.event_type_id === 2 ||
                        booking.event_type_id === 3 ||
                        booking.event_type_id === 7) &&
                      booking?.gender === "female"
                    ? t("female")
                    : "-"}
                </td>
                <td>
                  {booking.event_type_id === 1 ||
                  booking.event_type_id === 2 ||
                  booking.event_type_id === 3 ||
                  booking.event_type_id === 7
                    ? getAge(booking?.birth_year)
                    : "-"}
                </td>
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
                    ? booking?.payment_amount
                    : "-"}
                </td>
                <td>
                  {(booking.event_type_id === 1 ||
                    booking.event_type_id === 2 ||
                    booking.event_type_id === 3) && (
                    <button
                      onClick={() => handleOpenModal(booking)}
                      className={styles["cancel-button"]}
                      disabled={booking.event_type_id === 6}
                    >
                      {t("tableCancelButtonText")}
                    </button>
                  )}
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

export default PlayerCalendarResults;
