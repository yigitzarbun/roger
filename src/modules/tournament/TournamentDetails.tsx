import React, { useState, ChangeEvent, useEffect } from "react";
import styles from "./styles.module.scss";
import { useParams } from "react-router-dom";
import { useGetTournamentDetailsQuery } from "../../api/endpoints/TournamentsApi";
import TournamentDetail from "../../components/tournament-detail/results/TournamentDetail";
import { useGetPlayerLevelsQuery } from "../../api/endpoints/PlayerLevelsApi";
import TournamentDetailsNavigation from "../../components/tournament-detail/navigation/TournamentDetailsNavigation";
import TournamentDetailsInfo from "../../components/tournament-detail/details/TournamentDetailsInfo";
import PageLoading from "../../components/loading/PageLoading";
import PlayerTournamentFixture from "../../components/player-tournaments/player-tournament-fixture/PlayerTournamentFixture";
import { useGetTournamentParticipantsCountQuery } from "../../api/endpoints/TournamentsApi";
import { useGetTournamentMatchesByTournamentIdQuery } from "../../api/endpoints/TournamentMatchesApi";
import { useGetTournamentMatchRoundsQuery } from "../../api/endpoints/TournamentMatchRoundsApi";

const TournamentDetails = () => {
  const params = useParams();
  const tournamentId = Number(params?.tournament_id);
  const [currentPage, setCurrentPage] = useState(1);
  const [textSearch, setTextSearch] = useState("");
  const [playerLevelId, setPlayerLevelId] = useState(null);

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };
  const handlePlayerLevel = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setPlayerLevelId(isNaN(value) ? null : value);
  };
  const handleClear = () => {
    setTextSearch("");
    setPlayerLevelId(null);
    setCurrentPage(1);
  };

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const {
    data: tournamentDetails,
    isLoading: isTournamentDetailsLoading,
    refetch: refetchTournamentDetails,
  } = useGetTournamentDetailsQuery({
    currentPage: currentPage,
    textSearch: textSearch,
    playerLevelId: playerLevelId,
    tournamentId: Number(tournamentId),
  });

  const handleTournamentPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % tournamentDetails?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + tournamentDetails?.totalPages) %
        tournamentDetails?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };

  const [display, setDisplay] = useState("players");
  const handleDisplay = (value: string) => {
    setDisplay(value);
  };

  const {
    data: participantsCount,
    isLoading: isTournamentParticipantsCountLoading,
  } = useGetTournamentParticipantsCountQuery(tournamentId);

  const numberOfParticipants = Number(
    participantsCount?.[0]?.participant_count
  );

  const calculateInitialRoundId = (participants) => {
    return participants > 64
      ? 1
      : participants > 32
      ? 2
      : participants > 16
      ? 3
      : participants > 8
      ? 4
      : participants > 4
      ? 5
      : participants > 2
      ? 6
      : participants === 2 || participants === 1
      ? 7
      : null;
  };

  const initialRoundId = calculateInitialRoundId(numberOfParticipants);

  const [matchRound, setMatchRound] = useState(initialRoundId);

  const handleMatchRound = (id: number) => {
    setMatchRound(id);
  };

  const {
    data: tournamentMatches,
    isLoading: isTournamentMatchesLoading,
    refetch: refetchTournamentMatches,
  } = useGetTournamentMatchesByTournamentIdQuery({
    matchRoundId: matchRound,
    tournamentId: tournamentId,
  });

  const {
    data: tournamentMatchRounds,
    isLoading: isTournamentMatchRoundsLoading,
    refetch: refetchTournamentMatchRounds,
  } = useGetTournamentMatchRoundsQuery({});

  const filteredTournamentMatchRounds = tournamentMatchRounds?.filter(
    (round) =>
      round.tournament_match_round_id >= initialRoundId &&
      round.tournament_match_round_id !== 8
  );

  useEffect(() => {
    setMatchRound(initialRoundId);
  }, [initialRoundId]);

  useEffect(() => {
    refetchTournamentDetails();
  }, [currentPage, textSearch, playerLevelId, tournamentId]);

  if (isTournamentDetailsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["tournament-container"]}>
      <TournamentDetailsNavigation
        display={display}
        handleDisplay={handleDisplay}
      />
      {display === "players" && (
        <TournamentDetail
          tournamentDetails={tournamentDetails}
          textSearch={textSearch}
          playerLevelId={playerLevelId}
          currentPage={currentPage}
          handleTextSearch={handleTextSearch}
          handlePlayerLevel={handlePlayerLevel}
          handleTournamentPage={handleTournamentPage}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          playerLevels={playerLevels}
          handleClear={handleClear}
        />
      )}
      {display === "details" && (
        <TournamentDetailsInfo tournamentDetails={tournamentDetails} />
      )}
      {display === "fixture" && (
        <PlayerTournamentFixture
          numberOfParticipants={numberOfParticipants}
          tournamentMatches={tournamentMatches}
          filteredTournamentMatchRounds={filteredTournamentMatchRounds}
          matchRound={matchRound}
          handleMatchRound={handleMatchRound}
        />
      )}
    </div>
  );
};
export default TournamentDetails;
