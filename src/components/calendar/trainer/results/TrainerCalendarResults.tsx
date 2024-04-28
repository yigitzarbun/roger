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

import { useGetTrainerCalendarBookingsByFilterQuery } from "../../../../api/endpoints/BookingsApi";

import { useUpdateBookingMutation } from "../../../../api/endpoints/BookingsApi";

import { getAge } from "../../../../common/util/TimeFunctions";

interface TrainerCalendarResultsProps {
  date: string;
  clubId: number;
  eventTypeId: number;
  textSearch: string;
}
const TrainerCalendarResults = (props: TrainerCalendarResultsProps) => {
  const { date, clubId, eventTypeId, textSearch } = props;

  // fetch data
  const user = useAppSelector((store) => store.user.user.user);
  const formattedDate = date
    ? date.split("/").reverse().join("-") // Convert to "YYYY-MM-DD" format
    : "";
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
      booking_id: bookingData?.booking_id,
      registered_at: bookingData?.registered_at,
      event_date: bookingData?.event_date,
      event_time: bookingData?.event_time,
      court_price: bookingData?.court_price,
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
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Takvim</h2>
      </div>
      {trainerBookings?.length === 0 ? (
        <div>Onaylanmış gelecek etkinlik bulunmamaktadır.</div>
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
              <th>Tür </th>
              <th>Tarih</th>
              <th>Saat </th>
              <th>Kort</th>
              <th>Konum</th>
              <th>Ücret</th>
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
                      : `${booking?.playerFName} ${booking?.playerLName}`}
                  </Link>
                </td>
                <td>
                  {booking.student_group_name ? "" : booking.player_level_name}
                </td>
                <td>
                  {booking.student_group_name ? "" : booking.playerGender}
                </td>
                <td>
                  {booking.student_group_name
                    ? ""
                    : getAge(booking.playerBirthYear)}
                </td>
                <td>{booking?.event_type_name}</td>
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
                    İptal
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
