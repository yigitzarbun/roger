import React from "react";

import { useAppSelector } from "../../../../store/hooks";

import styles from "./styles.module.scss";

import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetCourtSurfaceTypesQuery } from "../../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetCourtStructureTypesQuery } from "../../../../api/endpoints/CourtStructureTypesApi";

const TrainerEventsResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );
  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});
  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});
  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});
  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});
  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});
  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const myEvents = bookings?.filter(
    (booking) =>
      (booking.inviter_id === user?.user?.user_id ||
        booking.invitee_id === user?.user?.user_id) &&
      booking.booking_status_type_id === 5
  );
  if (
    isBookingsLoading ||
    isEventTypesLoading ||
    isCourtsLoading ||
    isCourtsLoading ||
    isPlayerLevelsLoading ||
    isClubsLoading ||
    isCourtSurfaceTypesLoading ||
    isCourtStructureTypesLoading
  ) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles["results-container"]}>
      <h2 className={styles.title}>Etkinlik Geçmişi</h2>
      {myEvents.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Saat</th>
              <th>Tür</th>
              <th>Konum</th>
              <th>Kort</th>
              <th>Kort Yüzey</th>
              <th>Kort Mekan</th>
              <th>Oyuncu</th>
              <th>Oyuncu Seviye</th>
            </tr>
          </thead>
          <tbody>
            {myEvents?.map((event) => (
              <tr key={event.booking_id}>
                <td>{event.event_date.slice(0, 10)}</td>
                <td>{event.event_time.slice(0, 5)}</td>
                <td>
                  {
                    eventTypes?.find(
                      (type) => type.event_type_id === event.event_type_id
                    )?.event_type_name
                  }
                </td>
                <td>
                  {
                    clubs?.find((club) => club.club_id === event.club_id)
                      ?.club_name
                  }
                </td>
                <td>
                  {
                    courts?.find((court) => court.court_id === event.court_id)
                      ?.court_name
                  }
                </td>
                <td>
                  {
                    courtSurfaceTypes?.find(
                      (type) =>
                        type.court_surface_type_id ===
                        courts?.find(
                          (court) => court.court_id === event.court_id
                        )?.court_surface_type_id
                    )?.court_surface_type_name
                  }
                </td>
                <td>
                  {
                    courtStructureTypes?.find(
                      (type) =>
                        type.court_structure_type_id ===
                        courts?.find(
                          (court) => court.court_id === event.court_id
                        )?.court_structure_type_id
                    )?.court_structure_type_name
                  }
                </td>
                <td>
                  {event.inviter_id === user?.user?.user_id
                    ? `${
                        players?.find(
                          (player) => player.user_id === event.invitee_id
                        )?.fname
                      } ${
                        players?.find(
                          (player) => player.user_id === event.invitee_id
                        )?.lname
                      }`
                    : event.invitee_id === user?.user?.user_id
                    ? `${
                        players?.find(
                          (player) => player.user_id === event.inviter_id
                        )?.fname
                      } ${
                        players?.find(
                          (player) => player.user_id === event.inviter_id
                        )?.lname
                      }`
                    : "-"}
                </td>
                <td>
                  {event.inviter_id === user?.user?.user_id
                    ? playerLevels?.find(
                        (level) =>
                          level.player_level_id ===
                          players?.find(
                            (player) => player.user_id === event.invitee_id
                          )?.player_level_id
                      )?.player_level_name
                    : event.invitee_id === user?.user?.user_id
                    ? playerLevels?.find(
                        (level) =>
                          level.player_level_id ===
                          players?.find(
                            (player) => player.user_id === event.inviter_id
                          )?.player_level_id
                      )?.player_level_name
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Henüz tamamlanmış etkinlik bulunmamaktadır</p>
      )}
    </div>
  );
};
export default TrainerEventsResults;
