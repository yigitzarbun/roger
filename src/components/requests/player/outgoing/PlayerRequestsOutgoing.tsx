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
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import { useUpdateBookingMutation } from "../../../../api/endpoints/BookingsApi";
import { useGetPaymentsQuery } from "../../../../api/endpoints/PaymentsApi";
import { useGetUsersQuery } from "../../../../store/auth/apiSlice";
import { getAge } from "../../../../common/util/TimeFunctions";

const PlayerRequestsOutgoing = () => {
  const user = useAppSelector((store) => store?.user?.user?.user);

  const {
    data: outgoingBookings,
    isLoading: isBookingsLoading,
    refetch,
  } = useGetPlayerOutgoingRequestsQuery(user?.user_id);

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});
  const { data: payments, isLoading: isPaymentsLoading } = useGetPaymentsQuery(
    {}
  );

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: playerLevelTypes, isLoading: isPlayerLevelTypesLoading } =
    useGetPlayerLevelsQuery({});

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

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
    isEventTypesLoading ||
    isPlayerLevelTypesLoading ||
    isTrainerExperienceTypesLoading ||
    isPaymentsLoading ||
    isUsersLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Gönderilen Davetler</h2>
      </div>
      {outgoingBookings?.length === 0 ? (
        <div>Gönderilen antreman, maç veya ders daveti bulunmamaktadır</div>
      ) : (
        <>
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
                <th>
                  Ücret<span className={styles["fee"]}>*</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {outgoingBookings?.map((booking) => (
                <tr key={booking.booking_id}>
                  <td className={styles["pending-confirmation-text"]}>
                    {booking.booking_status_type_id === 1 ? "Bekleniyor" : ""}
                  </td>
                  <td className={styles["vertical-center"]}>
                    <Link
                      to={`${Paths.EXPLORE_PROFILE}${
                        users?.find(
                          (user) => user.user_id === booking.invitee_id
                        )?.user_type_id === 1
                          ? 1
                          : users?.find(
                              (user) => user.user_id === booking.invitee_id
                            )?.user_type_id === 2
                          ? 2
                          : ""
                      }/${booking.invitee_id}`}
                    >
                      <img
                        src={
                          booking?.image
                            ? booking?.image
                            : "/images/icons/avatar.png"
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
                        className={styles.name}
                      >
                        {`${booking?.fname}
                        ${booking?.lname}
                        `}
                      </Link>
                    ) : booking.event_type_id === 3 ? (
                      <Link
                        to={`${Paths.EXPLORE_PROFILE}2/${booking.invitee_id}`}
                        className={styles.name}
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
                    {booking.event_type_id === 1 || booking.event_type_id === 2
                      ? playerLevelTypes?.find(
                          (level) =>
                            level.player_level_id === booking?.player_level_id
                        )?.player_level_name
                      : booking.event_type_id === 3
                      ? trainerExperienceTypes?.find(
                          (type) =>
                            type.trainer_experience_type_id ===
                            booking?.trainer_experience_type_id
                        )?.trainer_experience_type_name
                      : ""}
                  </td>
                  <td>{booking?.gender}</td>
                  <td>{getAge(booking?.birth_year)}</td>
                  <td>
                    {
                      eventTypes?.find(
                        (type) => type.event_type_id === booking.event_type_id
                      )?.event_type_name
                    }
                  </td>
                  <td>{new Date(booking.event_date).toLocaleDateString()}</td>
                  <td>{booking.event_time.slice(0, 5)}</td>
                  <td>{booking?.court_name}</td>
                  <td>{booking?.club_name}</td>
                  <td>
                    {booking.event_type_id === 1 || booking.event_type_id === 2
                      ? payments?.find(
                          (payment) => booking.payment_id === payment.payment_id
                        )?.payment_amount / 2
                      : booking.event_type_id === 3
                      ? payments?.find(
                          (payment) => booking.payment_id === payment.payment_id
                        )?.payment_amount
                      : "External Booking"}
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
          <p className={styles["fee-text"]}>
            (*) Kort ücreti ve diğer tüm masraflar dahil ödeyeceğin tutar.
          </p>
        </>
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

export default PlayerRequestsOutgoing;
