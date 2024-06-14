import React, { useState, ChangeEvent, useEffect } from "react";
import styles from "./styles.module.scss";
import ClubTournamentFixtureResults from "../../components/club-tournament-fixture/results/ClubTournamentFixtureResults";
import { useGetTournamentMatchesByTournamentIdQuery } from "../../api/endpoints/TournamentMatchesApi";
import { useParams } from "react-router-dom";
import {
  useGetTournamentParticipantsCountQuery,
  useGetTournamentsByIdQuery,
} from "../../api/endpoints/TournamentsApi";
import ClubTournamentFixtureNavigation from "../../components/club-tournament-fixture/navigation/ClubTournamentFixtureNavigations";
import TournamentDetail from "../../components/tournament-detail/results/TournamentDetail";
import { useGetPlayerLevelsQuery } from "../../api/endpoints/PlayerLevelsApi";
import { useGetTournamentDetailsQuery } from "../../api/endpoints/TournamentsApi";
import PageLoading from "../../components/loading/PageLoading";
import { useGetTournamentMatchRoundsQuery } from "../../api/endpoints/TournamentMatchRoundsApi";
import { useAppSelector } from "../../store/hooks";
import { useGetClubCourtsQuery } from "../../api/endpoints/CourtsApi";
import { useGetTournamentParticipantsByTournamentIdQuery } from "../../api/endpoints/TournamentParticipantsApi";

const ClubTournamentFixture = () => {
  const params = useParams();
  const tournamentId = params?.tournament_id;

  const {
    data: participantsCount,
    isLoading: isTournamentParticipantsCountLoading,
  } = useGetTournamentParticipantsCountQuery(tournamentId);

  const numberOfParticipants = Number(
    participantsCount?.[0]?.participant_count
  );

  const initialRoundId =
    numberOfParticipants > 64
      ? 1
      : numberOfParticipants > 32
      ? 2
      : numberOfParticipants > 16
      ? 3
      : numberOfParticipants > 8
      ? 4
      : numberOfParticipants > 4
      ? 5
      : numberOfParticipants > 2
      ? 6
      : numberOfParticipants === 2
      ? 7
      : numberOfParticipants === 1
      ? 7
      : null;

  const [matchRound, setMatchRound] = useState(initialRoundId);

  const handleMatchRound = (id: number) => {
    setMatchRound(id);
  };

  const user = useAppSelector((store) => store?.user?.user);

  const { data: courts, isLoading: isCourtsLoading } = useGetClubCourtsQuery(
    user?.clubDetails?.club_id
  );

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
    currentPage: 1,
    textSearch: textSearch,
    playerLevelId: playerLevelId,
    tournamentId: tournamentId,
  });

  const {
    data: tournamentParticipants,
    isLoading: isTournamentParticipantsLoading,
  } = useGetTournamentParticipantsByTournamentIdQuery(tournamentId);

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

  const { data: selectedTournament, isLoading: isSelectedTournamentLoading } =
    useGetTournamentsByIdQuery(tournamentId);

  const [display, setDisplay] = useState("fixture");

  const handleDisplay = (value: string) => {
    setDisplay(value);
  };

  const { data: tournamentMatches, isLoading: isTournamentMatchesLoading } =
    useGetTournamentMatchesByTournamentIdQuery({
      matchRoundId: matchRound,
      tournamentId: tournamentId,
    });

  const {
    data: tournamentMatchRounds,
    isLoading: isTournamentMatchRoundsLoading,
  } = useGetTournamentMatchRoundsQuery({});

  const filteredTournamentMatchRounds = tournamentMatchRounds?.filter(
    (round) =>
      round.tournament_match_round_id >= initialRoundId &&
      round.tournament_match_round_id !== 8
  );

  if (
    isTournamentMatchesLoading ||
    isSelectedTournamentLoading ||
    isTournamentParticipantsCountLoading ||
    isTournamentDetailsLoading ||
    isPlayerLevelsLoading ||
    isTournamentMatchRoundsLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["club-tournament-fixture-container"]}>
      <ClubTournamentFixtureNavigation
        display={display}
        handleDisplay={handleDisplay}
      />
      {display === "fixture" && (
        <ClubTournamentFixtureResults
          initialRoundId={initialRoundId}
          numberOfParticipants={numberOfParticipants}
          tournamentMatches={tournamentMatches}
          filteredTournamentMatchRounds={filteredTournamentMatchRounds}
          courts={courts}
          tournamentParticipants={tournamentParticipants}
          user={user}
          tournamentId={Number(tournamentId)}
          matchRound={matchRound}
          handleMatchRound={handleMatchRound}
        />
      )}

      {display === "participants" && (
        <TournamentDetail
          tournamentDetails={tournamentDetails}
          textSearch={textSearch}
          playerLevelId={playerLevelId}
          handleTextSearch={handleTextSearch}
          handlePlayerLevel={handlePlayerLevel}
          handleTournamentPage={handleTournamentPage}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          playerLevels={playerLevels}
          currentPage={currentPage}
          handleClear={handleClear}
        />
      )}
    </div>
  );
};
export default ClubTournamentFixture;
