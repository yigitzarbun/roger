import React, { useState } from "react";
import styles from "./styles.module.scss";
import { TournamentMatchRounds } from "../../../api/endpoints/TournamentMatchRoundsApi";
import AddTournamentMatchModal from "../modals/add-match-booking/AddTournamentMatchModal";
import { localUrl } from "../../../common/constants/apiConstants";
import AddTournamentMatchScoreModal from "../modals/add-match-score/AddTournamentMatchScoreModal";

interface ClubTournamentFixtureResultsProps {
  initialRoundId: number;
  numberOfParticipants: number;
  tournamentMatches: any[];
  filteredTournamentMatchRounds: TournamentMatchRounds[];
  courts: any[];
  tournamentParticipants: any[];
  user: any;
  tournamentId: number;
  matchRound: number;
  handleMatchRound: (e: number) => void;
  refetchTournamentMatches: () => void;
  refetchTournamentMatchRounds: () => void;
}
const ClubTournamentFixtureResults = (
  props: ClubTournamentFixtureResultsProps
) => {
  const {
    initialRoundId,
    numberOfParticipants,
    tournamentMatches,
    filteredTournamentMatchRounds,
    courts,
    tournamentParticipants,
    user,
    tournamentId,
    matchRound,
    handleMatchRound,
    refetchTournamentMatches,
    refetchTournamentMatchRounds,
  } = props;
  console.log(tournamentMatches);
  const [
    addTournamentMatchScoreModalOpen,
    setAddTournamentMatchScoreModalOpen,
  ] = useState(false);
  const [selectedMatchScore, setSelectedMatchScore] = useState(null);

  const handleOpenAddTournamentMatchScoreModal = (matchScore: any) => {
    setSelectedMatchScore(matchScore);
    setAddTournamentMatchScoreModalOpen(true);
  };

  const closeAddTournamentMatchScoreModal = () => {
    setAddTournamentMatchScoreModalOpen(false);
  };

  const [addTournamentMatchModalOpen, setAddTournamentMatchModalOpen] =
    useState(false);

  const handleOpenAddTournamentMatchModal = () => {
    setAddTournamentMatchModalOpen(true);
  };

  const closeAddTournamentMatchModal = () => {
    setAddTournamentMatchModalOpen(false);
  };

  // Determine the number of matches required for the current match round
  const requiredMatches =
    {
      1: 64,
      2: 32,
      3: 16,
      4: 8,
      5: 4,
      6: 2,
      7: 1,
    }[matchRound] || 0;

  let totalMatches = tournamentMatches?.length;
  let emptyMatches = requiredMatches - totalMatches;

  return (
    <div className={styles["result-container"]}>
      <div className={styles["rounds-container"]}>
        {numberOfParticipants > 0 &&
          filteredTournamentMatchRounds?.map((round) => (
            <div
              key={round.tournament_match_round_id}
              onClick={() => handleMatchRound(round.tournament_match_round_id)}
              className={
                matchRound === round.tournament_match_round_id
                  ? styles["active-round"]
                  : styles["passive-round"]
              }
            >
              <p>{round.tournament_match_round_name}</p>
            </div>
          ))}
      </div>
      <div>
        {numberOfParticipants > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Oyuncu 1</th>
                <th>İsim</th>
                <th>Oyuncu 2</th>
                <th>İsim</th>
                <th>Tarih</th>
                <th>Saat</th>
                <th>Kort</th>
                <th>Skor</th>
                <th>Kazanan</th>
              </tr>
            </thead>
            <tbody>
              {tournamentMatches?.map((match) => (
                <tr
                  key={match.tournament_match_id}
                  className={styles["player-row"]}
                >
                  <td>
                    <img
                      src={
                        match.inviterimage
                          ? `${localUrl}/${match.inviterimage}`
                          : "/images/icons/avatar.jpg"
                      }
                      className={styles["player-image"]}
                    />
                  </td>
                  <td>{match.invitername}</td>
                  <td>
                    <img
                      src={
                        match.inviteeimage
                          ? `${localUrl}/${match.inviteeimage}`
                          : "/images/icons/avatar.jpg"
                      }
                      className={styles["player-image"]}
                    />
                  </td>
                  <td>{match.inviteename}</td>
                  <td>{match.event_date.slice(0, 10)}</td>
                  <td>{match.event_time.slice(0, 5)}</td>
                  <td>{match.court_name}</td>
                  <td>
                    {match.match_score_status_type_id === 1 ? (
                      <button
                        onClick={() =>
                          handleOpenAddTournamentMatchScoreModal(match)
                        }
                        className={styles["add-score-button"]}
                      >
                        Skor Ekle
                      </button>
                    ) : match.match_score_status_type_id === 3 &&
                      match?.inviter_third_set_games_won ? (
                      `${match?.inviter_first_set_games_won}-${match?.invitee_first_set_games_won} ${match?.inviter_second_set_games_won}-${match?.invitee_second_set_games_won} ${match?.inviter_third_set_games_won}-${match?.invitee_third_set_games_won}`
                    ) : match.match_score_status_type_id === 3 &&
                      !match?.inviter_third_set_games_won ? (
                      `${match?.inviter_first_set_games_won}-${match?.invitee_first_set_games_won} ${match?.inviter_second_set_games_won}-${match?.invitee_second_set_games_won}`
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {match.winner_id === match.inviter_id
                      ? match.invitername
                      : match.winner_id === match.invitee_id
                      ? match.inviteename
                      : "-"}
                  </td>
                </tr>
              ))}
              {Array.from({ length: emptyMatches }).map((_, index) => (
                <tr key={`empty-${index}`} className={styles["player-row"]}>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>
                    <button
                      onClick={handleOpenAddTournamentMatchModal}
                      className={styles["add-match-button"]}
                    >
                      Maç Ekle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          "Henüz turnuva katılımcısı yok"
        )}
      </div>
      {addTournamentMatchModalOpen && (
        <AddTournamentMatchModal
          addTournamentMatchModalOpen={addTournamentMatchModalOpen}
          closeAddTournamentMatchModal={closeAddTournamentMatchModal}
          courts={courts}
          tournamentParticipants={tournamentParticipants}
          user={user}
          matchRound={matchRound}
          tournamentId={tournamentId}
          refetchTournamentMatchRounds={refetchTournamentMatchRounds}
          refetchTournamentMatches={refetchTournamentMatches}
        />
      )}
      {addTournamentMatchScoreModalOpen && (
        <AddTournamentMatchScoreModal
          addTournamentMatchScoreModalOpen={addTournamentMatchScoreModalOpen}
          closeAddTournamentMatchScoreModal={closeAddTournamentMatchScoreModal}
          selectedMatchScore={selectedMatchScore}
          refetchTournamentMatches={refetchTournamentMatches}
        />
      )}
    </div>
  );
};

export default ClubTournamentFixtureResults;
