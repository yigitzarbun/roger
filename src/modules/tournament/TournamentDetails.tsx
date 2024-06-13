import React, { useState, ChangeEvent, useEffect } from "react";
import styles from "./styles.module.scss";
import { useParams } from "react-router-dom";
import { useGetTournamentDetailsQuery } from "../../api/endpoints/TournamentsApi";
import TournamentDetail from "../../components/tournament-detail/results/TournamentDetail";
import { useGetPlayerLevelsQuery } from "../../api/endpoints/PlayerLevelsApi";
import TournamentDetailsNavigation from "../../components/tournament-detail/navigation/TournamentDetailsNavigation";
import TournamentDetailsInfo from "../../components/tournament-detail/details/TournamentDetailsInfo";
import PageLoading from "../../components/loading/PageLoading";

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
    </div>
  );
};
export default TournamentDetails;
