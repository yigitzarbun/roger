import React, { useState } from "react";
import styles from "./styles.module.scss";
import { TournamentMatchRounds } from "../../../api/endpoints/TournamentMatchRoundsApi";

interface ClubTournamentFixtureResultsProps {
  initialRoundId: number;
  numberOfParticipants: number;
  tournamentMatches: any[];
  filteredTournamentMatchRounds: TournamentMatchRounds[];
}
const ClubTournamentFixtureResults = (
  props: ClubTournamentFixtureResultsProps
) => {
  const {
    initialRoundId,
    numberOfParticipants,
    tournamentMatches,
    filteredTournamentMatchRounds,
  } = props;
  const [matchRound, setMatchRound] = useState(initialRoundId);
  const handleMatchRound = (id: number) => {
    setMatchRound(id);
  };
  return (
    <div>
      <div className={styles["rounds-container"]}>
        {filteredTournamentMatchRounds?.map((round) => (
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
        {matchRound === 6 && (
          <div>
            <div>
              <input></input>
              <input></input>
              <select>
                <option>Kort 1</option>
              </select>
              <input type="date" />
              <input type="time" />
              <input placeholder="skor"></input>
              <button>Kaydet</button>
            </div>
            <div>
              <input></input>
              <input></input>
              <option>Kort 1</option>
              <button>Kaydet</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ClubTournamentFixtureResults;
