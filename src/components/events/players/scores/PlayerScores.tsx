import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import { useAppSelector } from "../../../../store/hooks";

import styles from "./styles.module.scss";

import { useGetPlayerMatchScoresWithBookingDetailsQuery } from "../../../../api/endpoints/MatchScoresApi";

import AddMatchScoreModal from "../modals/add/AddMatchScoreModal";
import EditMatchScoreModal from "../modals/edit/EditMatchScoreModal";
import PageLoading from "../../../../components/loading/PageLoading";

const PlayerScores = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: matchScores,
    isLoading: isMatchScoresLoading,
    refetch: refetchScores,
  } = useGetPlayerMatchScoresWithBookingDetailsQuery(user?.user?.user_id);

  const [isAddScoreModalOpen, setIsAddScoreModalOpen] = useState(false);

  const [isEditScoreModalOpen, setIsEditScoreModalOpen] = useState(false);

  const [selectedMatchScore, setSelectedMatchScore] = useState(null);

  const openAddScoreModal = (matchScoreDetails) => {
    setIsAddScoreModalOpen(true);
    setSelectedMatchScore(matchScoreDetails);
  };

  const closeAddScoreModal = () => {
    setIsAddScoreModalOpen(false);
  };

  const openEditScoreModal = (matchScoreDetails) => {
    setIsEditScoreModalOpen(true);
    setSelectedMatchScore(matchScoreDetails);
  };

  const closeEditScoreModal = () => {
    setIsEditScoreModalOpen(false);
  };

  useEffect(() => {
    refetchScores();
  }, [isAddScoreModalOpen, isEditScoreModalOpen]);
  if (isMatchScoresLoading) {
    return <PageLoading />;
  }
  console.log(matchScores);
  console.log(user?.user?.user_id);
  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <h2 className={styles.title}>Maç Skorları</h2>
      </div>
      {matchScores?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Oyuncu</th>
              <th>İsim</th>
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
              <tr key={event.booking_id} className={styles["player-row"]}>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${
                      event.inviter_id === user?.user?.user_id
                        ? event.invitee_id
                        : event.inviter_id
                    }`}
                  >
                    <img
                      src={
                        event.playerImage
                          ? event.playerImage
                          : "/images/icons/avatar.jpg"
                      }
                      alt={event.name}
                      className={styles["player-image"]}
                    />
                  </Link>
                </td>
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
                <td>{event?.player_level_name}</td>
                <td>{event.event_date.slice(0, 10)}</td>
                <td>{event.event_time.slice(0, 5)}</td>
                <td>{event?.event_type_name}</td>
                <td>{event?.club_name}</td>
                <td>{event?.court_name}</td>
                <td>{event?.court_surface_type_name}</td>
                <td>{event?.court_structure_type_name}</td>
                <td>
                  {matchScores?.find(
                    (match) =>
                      match.booking_id === event.booking_id &&
                      match.inviter_third_set_games_won === 0
                  )?.match_score_status_type_id === 3
                    ? `${event?.inviter_first_set_games_won}-${event?.invitee_first_set_games_won} ${event?.inviter_second_set_games_won}-${event?.invitee_second_set_games_won} `
                    : matchScores?.find(
                        (match) =>
                          match.booking_id === event.booking_id &&
                          match.match_score_status_type_id === 3 &&
                          match.inviter_third_set_games_won
                      )
                    ? `${event?.inviter_first_set_games_won}-${event?.invitee_first_set_games_won} ${event?.inviter_second_set_games_won}-${event?.invitee_second_set_games_won} ${event?.inviter_third_set_games_won}-${event?.invitee_third_set_games_won}`
                    : "-"}
                </td>
                <td>
                  {event?.match_score_status_type_id === 3 &&
                  event?.winner_id === user?.user?.user_id
                    ? `${user?.playerDetails?.fname} ${user?.playerDetails?.lname}`
                    : event?.match_score_status_type_id === 3 &&
                      event?.winner_id !== user?.user?.user_id
                    ? `${event?.fname} ${event?.lname}`
                    : "-"}
                </td>
                <td>
                  {event?.match_score_status_type_id === 1 ? (
                    <button
                      onClick={() => openAddScoreModal(event)}
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
                      onClick={() => openEditScoreModal(event)}
                      className={styles["edit-score-button"]}
                    >
                      Onayla / Düzelt
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
          selectedMatchScore={selectedMatchScore}
        />
      )}
      {isEditScoreModalOpen && (
        <EditMatchScoreModal
          isEditScoreModalOpen={isEditScoreModalOpen}
          closeEditScoreModal={closeEditScoreModal}
          selectedMatchScore={selectedMatchScore}
        />
      )}
    </div>
  );
};

export default PlayerScores;
