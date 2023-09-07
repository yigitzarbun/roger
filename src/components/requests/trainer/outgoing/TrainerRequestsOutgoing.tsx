import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";
import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import { useUpdateBookingMutation } from "../../../../api/endpoints/BookingsApi";

import CancelInviteModal, {
  BookingData,
} from "../../../invite/modals/cancel-modal/CancelInviteModal";
import PageLoading from "../../../../components/loading/PageLoading";

import { useGetPaymentsQuery } from "../../../../api/endpoints/PaymentsApi";

const TrainerRequestsOutgoing = () => {
  const { user } = useAppSelector((store) => store.user?.user);

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch,
  } = useGetBookingsQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});
  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: playerLevelTypes, isLoading: isPlayerLevelTypesLoading } =
    useGetPlayerLevelsQuery({});

  const { data: payments, isLoading: isPaymentsLoading } = useGetPaymentsQuery(
    {}
  );

  const date = new Date();
  const today = date.toLocaleDateString();
  const now = date.toLocaleTimeString();

  const outgoingBookings = bookings?.filter(
    (booking) =>
      booking.inviter_id === user?.user_id &&
      booking.booking_status_type_id === 1 &&
      (new Date(booking.event_date).toLocaleDateString() > today ||
        (new Date(booking.event_date).toLocaleDateString() === today &&
          booking.event_time >= now))
  );

  const currentYear = new Date().getFullYear();

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

      handleCloseModal();
    }
  }, [isSuccess]);

  if (
    isBookingsLoading ||
    isCourtsLoading ||
    isClubsLoading ||
    isEventTypesLoading ||
    isPlayersLoading ||
    isPlayerLevelTypesLoading
  ) {
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
              <tr key={booking.booking_id}>
                <td className={styles["pending-text"]}>
                  {booking.booking_status_type_id === 1 ? "Bekleniyor" : ""}
                </td>
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}1/${booking.invitee_id}`}>
                    <img
                      src={
                        players?.find(
                          (player) => player.user_id === booking.invitee_id
                        )?.image
                          ? players?.find(
                              (player) => player.user_id === booking.invitee_id
                            )?.image
                          : "/images/icons/avatar.png"
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
                    {`${
                      players?.find(
                        (player) => player.user_id === booking.invitee_id
                      )?.fname
                    } ${
                      players?.find(
                        (player) => player.user_id === booking.invitee_id
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
                          (player) => player.user_id === booking.invitee_id
                        )?.player_level_id
                    )?.player_level_name
                  }
                </td>
                <td>
                  {
                    players?.find(
                      (player) => player.user_id === booking.invitee_id
                    )?.gender
                  }
                </td>
                <td>
                  {currentYear -
                    players?.find(
                      (player) => player.user_id === booking.invitee_id
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
      <CancelInviteModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        bookingData={bookingData}
        handleCancelBooking={handleCancelBooking}
      />
    </div>
  );
};

export default TrainerRequestsOutgoing;
