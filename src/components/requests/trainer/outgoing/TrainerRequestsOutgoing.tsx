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

const TrainerRequestsOutgoing = () => {
  const { user } = useAppSelector((store) => store.user?.user);

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
      ...bookingData,
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
        <h2 className={styles["result-title"]}>Gönderilen Davetler</h2>
      </div>
      {outgoingBookings?.length === 0 ? (
        <div>Gönderilen ders daveti bulunmamaktadır</div>
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
              <th>Ücret</th>
            </tr>
          </thead>
          <tbody>
            {outgoingBookings?.map((booking) => (
              <tr key={booking.booking_id} className={styles["player-row"]}>
                <td className={styles["pending-text"]}>
                  {booking.booking_status_type_id === 1 ? "Bekleniyor" : ""}
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
                <td>{booking?.player_level_name}</td>
                <td>{booking?.gender}</td>
                <td>{getAge(booking?.birth_year)}</td>
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
        />
      )}
    </div>
  );
};

export default TrainerRequestsOutgoing;
