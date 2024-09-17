import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import paths from "../../../../routing/Paths";
import styles from "./styles.module.scss";
import { IoIosCheckmarkCircle } from "react-icons/io";
import CancelInviteModal from "../../../invite/modals/cancel-modal/CancelInviteModal";
import PageLoading from "../../../../components/loading/PageLoading";
import { useAppSelector } from "../../../../store/hooks";
import { BookingData } from "../../../invite/modals/cancel-modal/CancelInviteModal";
import { useGetTrainerCalendarBookingsByFilterQuery } from "../../../../../api/endpoints/BookingsApi";
import { useUpdateBookingMutation } from "../../../../../api/endpoints/BookingsApi";
import { getAge } from "../../../../common/util/TimeFunctions";
import { FaFilter } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

interface TrainerCalendarResultsProps {
  date: string;
  clubId: number;
  eventTypeId: number;
  textSearch: string;
  handleOpenFilter: () => void;
}
const TrainerCalendarResults = (props: TrainerCalendarResultsProps) => {
  const { date, clubId, eventTypeId, textSearch, handleOpenFilter } = props;

  const { t } = useTranslation();

  const user = useAppSelector((store) => store.user.user.user);

  const formattedDate = date ? date.split("/").reverse().join("-") : "";

  const {
    data: trainerBookings,
    isLoading: isTrainerBookingsLoading,
    refetch,
  } = useGetTrainerCalendarBookingsByFilterQuery({
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
      court_price:
        bookingData?.event_type_id === 3 ? bookingData?.court_price : 0,
      lesson_price: bookingData?.lesson_price,
      invitation_note: bookingData?.invitation_note,
      payment_id: bookingData?.payment_id,
      event_type_id: bookingData?.event_type_id,
      club_id: bookingData?.club_id,
      court_id: bookingData?.court_id,
      inviter_id: bookingData?.inviter_id,
      invitee_id: bookingData?.invitee_id,
      booking_status_type_id: 4,
    };
    updateBooking(cancelledBookingData);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Ders iptal edildi");
      handleCloseModal();
    }
  }, [isSuccess]);

  if (isTrainerBookingsLoading) {
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
      {trainerBookings?.length === 0 ? (
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
            {trainerBookings?.map((booking) => (
              <tr key={booking.booking_id} className={styles["trainer-row"]}>
                <td>
                  {booking.booking_status_type_id === 2 && (
                    <IoIosCheckmarkCircle className={styles.done} />
                  )}
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${
                      booking.event_type_id === 3
                        ? 1
                        : booking.event_type_id === 5 ||
                          booking.event_type_id === 6
                        ? 3
                        : ""
                    }/${
                      booking.event_type_id === 3
                        ? booking.playerUserId
                        : booking.event_type_id === 5 ||
                          booking.event_type_id === 6
                        ? booking.clubUserId
                        : ""
                    }`}
                  >
                    <img
                      src={
                        booking.event_type_id === 3 && booking.playerImage
                          ? booking.playerImage
                          : (booking.event_type_id === 5 ||
                              booking.event_type_id === 6) &&
                            booking.clubImage
                          ? booking.clubImage
                          : "/images/icons/avatar.jpg"
                      }
                      className={styles["trainer-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${
                      booking.event_type_id === 3
                        ? 1
                        : booking.event_type_id === 5 ||
                          booking.event_type_id === 6
                        ? 3
                        : ""
                    }/${
                      booking.event_type_id === 3
                        ? booking.playerUserId
                        : booking.event_type_id === 5 ||
                          booking.event_type_id === 6
                        ? booking.clubUserId
                        : ""
                    }`}
                    className={styles["trainer-name"]}
                  >
                    {booking.student_group_name
                      ? booking.student_group_name
                      : `${booking?.playerFname} ${booking?.playerLname}`}
                  </Link>
                </td>
                <td>
                  {booking.student_group_name
                    ? ""
                    : (booking.event_type_id === 3 ||
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
                  {booking.student_group_name
                    ? ""
                    : booking?.playerGender === "female"
                    ? t("female")
                    : booking?.playerGender === "male"
                    ? t("male")
                    : "-"}
                </td>
                <td>
                  {booking.student_group_name
                    ? ""
                    : getAge(booking.playerBirthYear)}
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
                  {booking?.event_type_id === 3 ? booking?.lesson_price : "-"}
                </td>
                <td>
                  <button
                    onClick={() => handleOpenModal(booking)}
                    className={styles["cancel-button"]}
                  >
                    {t("tableCancelButtonText")}
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

export default TrainerCalendarResults;
