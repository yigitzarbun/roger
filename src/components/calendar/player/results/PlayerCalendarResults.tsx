import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import CancelInviteModal from "../../../invite/modals/cancel-modal/CancelInviteModal";

import { BookingData } from "../../../invite/modals/cancel-modal/CancelInviteModal";

import PageLoading from "../../../../components/loading/PageLoading";

import { useGetPlayerCalendarBookingsByFilterQuery } from "../../../../api/endpoints/BookingsApi";
import { useUpdateBookingMutation } from "../../../../api/endpoints/BookingsApi";
import { getAge } from "../../../../common/util/TimeFunctions";

interface PlayerCalendarResultsProps {
  date: string;
  eventTypeId: number;
  clubId: number;
  textSearch: string;
}

const PlayerCalendarResults = (props: PlayerCalendarResultsProps) => {
  const { date, eventTypeId, clubId, textSearch } = props;

  const user = useAppSelector((store) => store?.user?.user?.user);

  // Convert to "YYYY-MM-DD" format
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
  console.log(filteredBookings);
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
        <h2 className={styles.title}>Takvim</h2>
      </div>
      {filteredBookings?.length === 0 ? (
        <div>Onaylanmış gelecek etkinlik bulunmamaktadır.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Durum</th>
              <th>Taraf</th>
              <th>İsim</th>
              <th>Seviye</th>
              <th>Cinsiyet</th>
              <th>Yaş</th>
              <th>Tür </th>
              <th>Tarih</th>
              <th>Saat </th>
              <th>Kort</th>
              <th>Konum</th>
              <th>Ücret</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings?.map((booking) => (
              <tr key={booking?.booking_id} className={styles["player-row"]}>
                <td>
                  {booking.booking_status_type_id === 2 ? "Onaylandı" : ""}
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
                  {booking.event_type_id === 1 ||
                  booking.event_type_id === 2 ||
                  booking.event_type_id === 7
                    ? booking?.player_level_name
                    : booking.event_type_id === 3
                    ? booking?.trainer_experience_type_name
                    : "-"}
                </td>
                <td>
                  {booking.event_type_id === 1 ||
                  booking.event_type_id === 2 ||
                  booking.event_type_id === 3 ||
                  booking.event_type_id === 7
                    ? booking?.gender
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
                      İptal
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
