import React from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";
import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";

const PlayerCalendarResults = () => {
  const user = useAppSelector((store) => store.user.user.user);

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

  const myBookings = bookings?.filter(
    (booking) =>
      (booking.inviter_id === user.user_id ||
        booking.invitee_id === user.user_id) &&
      booking.booking_status_type_id === 2
  );
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Takvim</h2>
      </div>
      {myBookings?.length === 0 ? (
        <div>Onaylanmış gelecek etkinlik bulunmamaktadır.</div>
      ) : (
        <table>
          <thead>
            <tr>
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
            </tr>
          </thead>
          <tbody>
            {myBookings?.map((booking) => (
              <tr className={styles["player-row"]}>
                <td>
                  <img
                    src="/images/players/player1.png"
                    className={styles["player-image"]}
                  />
                </td>
                <td>Hasan Karayel</td>
                <td>Başlangıç</td>
                <td>Erkek</td>
                <td>25</td>
                <td>Antreman</td>
                <td>21.05.2023</td>
                <td>21:00</td>
                <td>Kort 1</td>
                <td>Enka Spor ..</td>
                <td>
                  <button className={styles["cancel-button"]}>İptal et</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PlayerCalendarResults;
