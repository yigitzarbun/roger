import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import CancelInviteModal from "../../../invite/modals/cancel-modal/CancelInviteModal";

import { BookingData } from "../../../invite/modals/cancel-modal/CancelInviteModal";

import PageLoading from "../../../../components/loading/PageLoading";

import { useGetPlayerBookingsByUserIdQuery } from "../../../../api/endpoints/BookingsApi";
import { useUpdateBookingMutation } from "../../../../api/endpoints/BookingsApi";
import { getAge } from "../../../../common/util/TimeFunctions";

interface PlayerCalendarResultsProps {
  date: string;
  eventTypeId: number;
  clubId: number;
}
const PlayerCalendarResults = (props: PlayerCalendarResultsProps) => {
  const { date, eventTypeId, clubId } = props;

  const user = useAppSelector((store) => store?.user?.user?.user);

  const { data: playerBookings, isLoading: isBookingsLoading } =
    useGetPlayerBookingsByUserIdQuery(user?.user_id);

  const filteredBookings = playerBookings?.filter((booking) => {
    const eventDate = new Date(booking.event_date);
    if (date === "" && eventTypeId === null && clubId === null) {
      return true;
    } else if (
      (date === eventDate.toLocaleDateString() || date === "") &&
      (eventTypeId === booking.event_type_id || eventTypeId === null) &&
      (clubId === booking.club_id || clubId === null)
    ) {
      return booking;
    }
  });

  // update booking
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
      ...bookingData,
      booking_status_type_id: 4,
    };
    updateBooking(cancelledBookingData);
  };

  useEffect(() => {
    if (isSuccess) {
      handleCloseModal();
    }
  }, [isSuccess]);

  if (isBookingsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Takvim</h2>
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
              <tr key={booking?.booking_id}>
                <td>
                  {booking.booking_status_type_id === 2 ? "Onaylandı" : ""}
                </td>
                <td className={styles["vertical-center"]}>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${
                      booking.event_type_id === 1 || booking.event_type_id === 2
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
                        (booking.event_type_id === 1 ||
                          booking.event_type_id === 2 ||
                          booking.event_type_id === 3) &&
                        booking.image
                          ? booking?.image
                          : booking.event_type_id === 6 && booking?.clubImage
                          ? booking?.clubImage
                          : "/images/icons/avatar.png"
                      }
                      className={styles["profile-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}${
                      booking.event_type_id === 1 || booking.event_type_id === 2
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
                    className={styles["opponent-name"]}
                  >
                    {booking.event_type_id === 1 ||
                    booking.event_type_id === 2 ||
                    booking.event_type_id === 3
                      ? `${booking.fname} ${booking.lname}`
                      : booking.event_type_id === 6
                      ? booking?.student_group_name
                      : "-"}
                  </Link>
                </td>
                <td>
                  {booking.event_type_id === 1 || booking.event_type_id === 2
                    ? booking?.player_level_name
                    : booking.event_type_id === 3
                    ? booking?.trainer_experience_type_name
                    : "-"}
                </td>
                <td>
                  {booking.event_type_id === 1 ||
                  booking.event_type_id === 2 ||
                  booking.event_type_id === 3
                    ? booking?.gender
                    : "-"}
                </td>
                <td>
                  {booking.event_type_id === 1 ||
                  booking.event_type_id === 2 ||
                  booking.event_type_id === 3
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
        />
      )}
    </div>
  );
};

export default PlayerCalendarResults;
