import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import { useAppSelector } from "../../../../store/hooks";

import styles from "./styles.module.scss";

import { useGetEventTypesQuery } from "../../../../api/endpoints/EventTypesApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import { useGetCourtSurfaceTypesQuery } from "../../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetCourtStructureTypesQuery } from "../../../../api/endpoints/CourtStructureTypesApi";
import { useGetPlayerMatchScoresWithBookingDetailsQuery } from "../../../../api/endpoints/MatchScoresApi";

import AddMatchScoreModal from "../modals/add/AddMatchScoreModal";
import EditMatchScoreModal from "../modals/edit/EditMatchScoreModal";
import PageLoading from "../../../../components/loading/PageLoading";

const PlayerScores = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useGetEventTypesQuery({});

  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});

  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const {
    data: matchScores,
    isLoading: isMatchScoresLoading,
    refetch: refetchScores,
  } = useGetPlayerMatchScoresWithBookingDetailsQuery(user?.user?.user_id);

  const [isAddScoreModalOpen, setIsAddScoreModalOpen] = useState(false);

  const [isEditScoreModalOpen, setIsEditScoreModalOpen] = useState(false);

  const [selectedMatchScoreId, setSelectedMatchScoreId] = useState(null);

  const handleSelectedMatchDetails = (booking_id: number) => {
    return matchScores?.find((match) => match.booking_id === booking_id)
      ?.match_score_id;
  };

  const openAddScoreModal = (booking_id: number) => {
    setIsAddScoreModalOpen(true);
    setSelectedMatchScoreId(handleSelectedMatchDetails(booking_id));
  };

  const closeAddScoreModal = () => {
    setIsAddScoreModalOpen(false);
  };

  const openEditScoreModal = (booking_id: number) => {
    setIsEditScoreModalOpen(true);
    setSelectedMatchScoreId(handleSelectedMatchDetails(booking_id));
  };

  const closeEditScoreModal = () => {
    setIsEditScoreModalOpen(false);
  };

  const selectedEventType = (event_type_id: number) => {
    return eventTypes?.find((type) => type.event_type_id === event_type_id);
  };

  const selectedScore = (booking_id: number) => {
    return matchScores?.find((score) => score.booking_id === booking_id);
  };

  useEffect(() => {
    refetchScores();
  }, [isAddScoreModalOpen, isEditScoreModalOpen]);
  if (
    isEventTypesLoading ||
    isPlayerLevelsLoading ||
    isCourtSurfaceTypesLoading ||
    isCourtStructureTypesLoading ||
    isMatchScoresLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["results-container"]}>
      <h2 className={styles.title}>Maç Skorları</h2>
      {matchScores?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Oyuncu</th>
              <th>Seviye</th>
              <th>Tarih</th>
              <th>Saat</th>
              <th>Tür</th>
              <th>Konum</th>
              <th>Kort</th>
              <th>Yüzey</th>
              <th>Mekan</th>
              <th>Skor</th>
              <th>Kazanan</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {matchScores?.map((event) => (
              <tr key={event.booking_id}>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${
                      event.inviter_id === user?.user?.user_id
                        ? event.invitee_id
                        : event.inviter_id
                    }`}
                    className={styles["player-name"]}
                  >
                    {`${event?.fname} ${event?.lname}`}
                  </Link>
                </td>
                <td>
                  {
                    playerLevels?.find(
                      (level) =>
                        level.player_level_id === event?.player_level_id
                    )?.player_level_name
                  }
                </td>
                <td>{event.event_date.slice(0, 10)}</td>
                <td>{event.event_time.slice(0, 5)}</td>
                <td>
                  {selectedEventType(event.event_type_id)?.event_type_name}
                </td>
                <td>{event?.club_name}</td>
                <td>{event?.court_name}</td>
                <td>
                  {
                    courtSurfaceTypes?.find(
                      (type) =>
                        type.court_surface_type_id ===
                        event?.court_surface_type_id
                    )?.court_surface_type_name
                  }
                </td>
                <td>
                  {
                    courtStructureTypes?.find(
                      (type) =>
                        type.court_structure_type_id ===
                        event?.court_structure_type_id
                    )?.court_structure_type_name
                  }
                </td>
                <td>
                  {matchScores?.find(
                    (match) =>
                      match.booking_id === event.booking_id &&
                      match.inviter_third_set_games_won === 0
                  )?.match_score_status_type_id === 3
                    ? `${
                        selectedScore(event.booking_id)
                          ?.inviter_first_set_games_won
                      }-${
                        selectedScore(event.booking_id)
                          ?.invitee_first_set_games_won
                      } ${
                        selectedScore(event.booking_id)
                          ?.inviter_second_set_games_won
                      }-${
                        selectedScore(event.booking_id)
                          ?.invitee_second_set_games_won
                      } `
                    : matchScores?.find(
                        (match) =>
                          match.booking_id === event.booking_id &&
                          match.match_score_status_type_id === 3 &&
                          match.inviter_third_set_games_won
                      )
                    ? `${
                        selectedScore(event.booking_id)
                          ?.inviter_first_set_games_won
                      }-${
                        selectedScore(event.booking_id)
                          ?.invitee_first_set_games_won
                      } ${
                        selectedScore(event.booking_id)
                          ?.inviter_second_set_games_won
                      }-${
                        selectedScore(event.booking_id)
                          ?.invitee_second_set_games_won
                      } ${
                        selectedScore(event.booking_id)
                          ?.inviter_third_set_games_won
                      }-${
                        selectedScore(event.booking_id)
                          ?.invitee_third_set_games_won
                      }`
                    : "-"}
                </td>
                <td>
                  {event?.match_score_status_type_id === 3
                    ? `${event?.fname} ${event?.lname}`
                    : "-"}
                </td>
                <td>
                  {event?.match_score_status_type_id === 1 ? (
                    <button
                      onClick={() => openAddScoreModal(event.booking_id)}
                      className={styles["add-score-button"]}
                    >
                      Skor Paylaş
                    </button>
                  ) : event.reporter_id === user?.user?.user_id &&
                    event?.match_score_status_type_id === 2 ? (
                    <p className={styles["waiting-confirmation-text"]}>
                      Onay Bekleniyor
                    </p>
                  ) : event.reporter_id !== user?.user?.user_id &&
                    event?.match_score_status_type_id === 2 ? (
                    <button
                      onClick={() => openEditScoreModal(event.booking_id)}
                      className={styles["add-score-button"]}
                    >
                      Onayla / Değişiklik Talep Et
                    </button>
                  ) : event?.match_score_status_type_id === 3 ? (
                    <p className={styles["confirmed-text"]}>Skor onaylandı</p>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Tamamlanan etkinlik bulunmamaktadır</p>
      )}
      {isAddScoreModalOpen && (
        <AddMatchScoreModal
          isAddScoreModalOpen={isAddScoreModalOpen}
          closeAddScoreModal={closeAddScoreModal}
          selectedMatchScoreId={selectedMatchScoreId}
        />
      )}
      {isEditScoreModalOpen && (
        <EditMatchScoreModal
          isEditScoreModalOpen={isEditScoreModalOpen}
          closeEditScoreModal={closeEditScoreModal}
          selectedMatchScoreId={selectedMatchScoreId}
        />
      )}
    </div>
  );
};

export default PlayerScores;
