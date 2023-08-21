import React from "react";

import { useAppSelector } from "../../../../store/hooks";

import styles from "./styles.module.scss";

import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetCourtSurfaceTypesQuery } from "../../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetCourtStructureTypesQuery } from "../../../../api/endpoints/CourtStructureTypesApi";

const PlayerEventsResults = () => {
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
  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );
  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

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
    isTrainersLoading ||
    isTrainerExperienceTypesLoading ||
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
              <th>Eğitmen</th>
              <th>Eğitmen Tecrübe</th>
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
                  {(event.event_type_id === 1 || event.event_type_id === 2) &&
                  event.inviter_id === user?.user?.user_id
                    ? `${
                        players?.find(
                          (player) => player.user_id === event.invitee_id
                        )?.fname
                      } ${
                        players?.find(
                          (player) => player.user_id === event.invitee_id
                        )?.lname
                      }`
                    : (event.event_type_id === 1 ||
                        event.event_type_id === 2) &&
                      event.invitee_id === user?.user?.user_id
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
                  {(event.event_type_id === 1 || event.event_type_id === 2) &&
                  event.inviter_id === user?.user?.user_id
                    ? playerLevels?.find(
                        (level) =>
                          level.player_level_id ===
                          players?.find(
                            (player) => player.user_id === event.invitee_id
                          )?.player_level_id
                      )?.player_level_name
                    : (event.event_type_id === 1 ||
                        event.event_type_id === 2) &&
                      event.invitee_id === user?.user?.user_id
                    ? playerLevels?.find(
                        (level) =>
                          level.player_level_id ===
                          players?.find(
                            (player) => player.user_id === event.inviter_id
                          )?.player_level_id
                      )?.player_level_name
                    : "-"}
                </td>
                <td>
                  {event.event_type_id === 3 &&
                  event.inviter_id === user?.user?.user_id
                    ? `${
                        trainers?.find(
                          (trainer) => trainer.user_id === event.invitee_id
                        )?.fname
                      } ${
                        trainers?.find(
                          (trainer) => trainer.user_id === event.invitee_id
                        )?.lname
                      }`
                    : event.event_type_id === 3 &&
                      event.invitee_id === user?.user?.user_id
                    ? `${
                        trainers?.find(
                          (trainer) => trainer.user_id === event.inviter_id
                        )?.fname
                      } ${
                        trainers?.find(
                          (trainer) => trainer.user_id === event.inviter_id
                        )?.lname
                      }`
                    : "-"}
                </td>
                <td>
                  {event.event_type_id === 3 &&
                  event.inviter_id === user?.user?.user_id
                    ? trainerExperienceTypes(
                        (type) =>
                          type.trainer_experience_type_id ===
                          trainers?.find(
                            (trainer) => trainer.user_id === event.invitee_id
                          )?.trainer_experience_type_id
                      )?.trainer_experience_type_name
                    : event.event_type_id === 3 &&
                      event.invitee_id === user?.user?.user_id
                    ? trainerExperienceTypes(
                        (type) =>
                          type.trainer_experience_type_id ===
                          trainers?.find(
                            (trainer) => trainer.user_id === event.inviter_id
                          )?.trainer_experience_type_id
                      )?.trainer_experience_type_name
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

export default PlayerEventsResults;
