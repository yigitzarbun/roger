import React, { useState, useEffect } from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import { useUpdateBookingMutation } from "../../../../api/endpoints/BookingsApi";

import AcceptInviteModal, {
  AcceptBookingData,
} from "../../../invite/accept-modal/AcceptInviteModal";

import DeclineInviteModal, {
  DeclineBookingData,
} from "../../../invite/decline-modal/DeclineInviteModal";

const TrainerRequestsIncoming = () => {
  const { user } = useAppSelector((store) => store.user.user);

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch,
  } = useGetBookingsQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});
  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});
  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: playerLevelTypes, isLoading: isPlayerLevelTypesLoading } =
    useGetPlayerLevelsQuery({});

  const incomingBookings = bookings?.filter(
    (booking) =>
      booking.invitee_id === user?.user_id &&
      booking.booking_status_type_id === 1
  );
  console.log(incomingBookings);
  const currentYear = new Date().getFullYear();

  const [
    updateBooking,
    { data: updateBookingData, isSuccess: isUpdateBookingSuccess },
  ] = useUpdateBookingMutation({});

  // accept booking
  const [acceptBookingData, setAcceptBookingData] =
    useState<AcceptBookingData | null>(null);

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);

  const handleOpenAcceptModal = (data) => {
    setAcceptBookingData(data);
    setIsAcceptModalOpen(true);
  };

  const handleCloseAcceptModal = () => {
    setIsAcceptModalOpen(false);
  };

  const handleAcceptBooking = () => {
    const acceptedBookingData = {
      ...acceptBookingData,
      booking_status_type_id: 2,
    };
    updateBooking(acceptedBookingData);
    setAcceptBookingData(null);
  };

  // decline booking
  const [declineBookingData, setDeclineBookingData] =
    useState<DeclineBookingData | null>(null);

  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);

  const handleOpenDeclineModal = (data) => {
    setDeclineBookingData(data);
    setIsDeclineModalOpen(true);
  };

  const handleCloseDeclineModal = () => {
    setIsDeclineModalOpen(false);
  };

  const handleDeclineBooking = () => {
    const declineddBookingData = {
      ...declineBookingData,
      booking_status_type_id: 3,
    };
    updateBooking(declineddBookingData);
    setDeclineBookingData(null);
  };

  useEffect(() => {
    if (isUpdateBookingSuccess) {
      refetch();
      handleCloseAcceptModal();
      handleCloseDeclineModal();
    }
  }, [isUpdateBookingSuccess]);

  if (
    isBookingsLoading ||
    isCourtsLoading ||
    isClubsLoading ||
    isTrainersLoading ||
    isEventTypesLoading ||
    isPlayersLoading ||
    isPlayerLevelTypesLoading
  ) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Gelen Davetler</h2>
      </div>
      {incomingBookings?.length === 0 ? (
        <div>Gelen ders daveti bulunmamaktadır</div>
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
              <th>
                Ücret<span className={styles["fee"]}>*</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {incomingBookings?.map((booking) => (
              <tr key={booking.booking_id} className={styles["trainer-row"]}>
                <td>
                  {booking.booking_status_type_id === 1 ? "Bekleniyor" : ""}
                </td>
                <td>
                  <img
                    src="/images/players/player1.png"
                    className={styles["trainer-image"]}
                  />
                </td>
                <td>
                  {`${
                    players?.find(
                      (player) => player.user_id === booking.inviter_id
                    )?.fname
                  } ${
                    players?.find(
                      (player) => player.user_id === booking.inviter_id
                    )?.lname
                  }`}
                </td>
                <td>
                  {
                    playerLevelTypes?.find(
                      (level) =>
                        level.player_level_id ===
                        players?.find(
                          (player) => player.user_id === booking.inviter_id
                        )?.player_level_id
                    )?.player_level_name
                  }
                </td>
                <td>
                  {
                    players?.find(
                      (player) => player.user_id === booking.inviter_id
                    )?.gender
                  }
                </td>
                <td>
                  {currentYear -
                    players?.find(
                      (player) => player.user_id === booking.inviter_id
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
                    trainers?.find(
                      (trainer) => trainer.user_id === booking.invitee_id
                    )?.price_hour
                  }
                </td>
                <td>
                  <button
                    onClick={() => handleOpenAcceptModal(booking)}
                    className={styles["accept-button"]}
                  >
                    Kabul et
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleOpenDeclineModal(booking)}
                    className={styles["decline-button"]}
                  >
                    Reddet
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <AcceptInviteModal
        isAcceptModalOpen={isAcceptModalOpen}
        handleCloseAcceptModal={handleCloseAcceptModal}
        acceptBookingData={acceptBookingData}
        handleAcceptBooking={handleAcceptBooking}
      />
      <DeclineInviteModal
        isDeclineModalOpen={isDeclineModalOpen}
        handleCloseDeclineModal={handleCloseDeclineModal}
        declineBookingData={declineBookingData}
        handleDeclineBooking={handleDeclineBooking}
      />
    </div>
  );
};

export default TrainerRequestsIncoming;
