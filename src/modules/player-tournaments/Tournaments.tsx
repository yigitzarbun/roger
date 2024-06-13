import React, { useState, ChangeEvent, useEffect } from "react";
import styles from "./styles.module.scss";
import PlayerTournamentsNavigation from "../../components/player-tournaments/navigation/PlayerTournamentsNavigation";
import AllTournaments from "../../components/player-tournaments/all-tournaments/AllTournaments";
import { useGetPaginatedPlayerActiveTournamentsQuery } from "../../api/endpoints/TournamentParticipantsApi";
import { useAppSelector } from "../../store/hooks";
import PlayerActiveTournaments from "../../components/player-tournaments/my-tournaments/PlayerActiveTournaments";
import { useGetLocationsQuery } from "../../api/endpoints/LocationsApi";
import { useGetClubsQuery } from "../../api/endpoints/ClubsApi";
import PageLoading from "../../components/loading/PageLoading";

const Tournaments = () => {
  const [display, setDisplay] = useState("all-tournaments");
  const handleDisplay = (value: string) => {
    setDisplay(value);
  };

  const user = useAppSelector((store) => store?.user?.user);

  const [currentPage, setCurrentPage] = useState(1);
  const [textSearch, setTextSearch] = useState("");
  const [locationId, setLocationId] = useState(null);
  const [clubId, setClubId] = useState(null);

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };
  const handleLocation = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setLocationId(isNaN(value) ? null : value);
  };
  const handleClub = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setClubId(isNaN(value) ? null : value);
  };

  const handleClear = () => {
    setTextSearch("");
    setLocationId(null);
    setClubId(null);
  };

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const {
    data: myTournaments,
    isLoading: isMyTournamentsLoading,
    refetch: refetchMyTournaments,
  } = useGetPaginatedPlayerActiveTournamentsQuery({
    currentPage: 1,
    textSearch: textSearch,
    locationId: locationId,
    clubUserId: clubId,
    playerUserId: user?.user?.user_id,
  });

  const handleTournamentPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % myTournaments?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + myTournaments?.totalPages) %
        myTournaments?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };

  useEffect(() => {
    refetchMyTournaments();
  }, [textSearch, locationId, clubId, clubId, currentPage]);

  if (isMyTournamentsLoading || isLocationsLoading || isClubsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["tournaments-container"]}>
      <PlayerTournamentsNavigation
        display={display}
        handleDisplay={handleDisplay}
        myTournaments={myTournaments}
      />
      {display === "all-tournaments" && (
        <AllTournaments
          refetchMyTournaments={refetchMyTournaments}
          locations={locations}
          clubs={clubs}
        />
      )}
      {display === "my-tournaments" && (
        <PlayerActiveTournaments
          myTournaments={myTournaments}
          textSearch={textSearch}
          locationId={locationId}
          clubId={clubId}
          handleTextSearch={handleTextSearch}
          handleLocation={handleLocation}
          handleClub={handleClub}
          handleTournamentPage={handleTournamentPage}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          currentPage={currentPage}
          locations={locations}
          handleClear={handleClear}
          clubs={clubs}
          refetchMyTournaments={refetchMyTournaments}
        />
      )}
    </div>
  );
};

export default Tournaments;
