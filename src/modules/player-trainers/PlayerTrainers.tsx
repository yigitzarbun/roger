import React, { useState, ChangeEvent, useEffect } from "react";
import styles from "./styles.module.scss";
import PlayerTrainersSearch from "../../components/player-trainers/search/PlayerTrainersSearch";
import PlayerTrainersResults from "../../components/player-trainers/results/PlayerTrainersResults";
import { useGetPaginatedPlayerTrainersQuery } from "../../api/endpoints/StudentsApi";
import { useAppSelector } from "../../store/hooks";
import PageLoading from "../../components/loading/PageLoading";

const PlayerTrainers = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const [trainerLevelId, setTrainerLevelId] = useState<number | null>(null);
  const [gender, setGender] = useState<string>("");
  const [locationId, setLocationId] = useState<number | null>(null);
  const [clubId, setClubId] = useState<number | null>(null);
  const [textSearch, setTextSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const handleLevel = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setTrainerLevelId(isNaN(value) ? null : value);
  };

  const handleGender = (event: ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
  };

  const handleLocation = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setLocationId(isNaN(value) ? null : value);
  };

  const handleClub = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setClubId(isNaN(value) ? null : value);
  };

  const {
    data: playerTrainers,
    isLoading: isPlayerTrainersLoading,
    refetch: refetchPlayerTrainers,
  } = useGetPaginatedPlayerTrainersQuery({
    playerUserId: user?.user?.user_id,
    perPage: 4,
    currentPageNumber: currentPage,
    trainerExperienceTypeId: trainerLevelId,
    selectedGender: gender,
    locationId: locationId,
    clubId: clubId,
    textSearch: textSearch,
  });
  const handleClear = () => {
    setTextSearch("");
    setTrainerLevelId(null);
    setGender("");
    setLocationId(null);
    setClubId(null);
  };

  const handleTrainerPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % playerTrainers?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + playerTrainers?.totalPages) %
        playerTrainers?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };

  useEffect(() => {
    refetchPlayerTrainers();
  }, [currentPage, trainerLevelId, gender, locationId, clubId, textSearch]);

  if (isPlayerTrainersLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["player-trainers-container"]}>
      <PlayerTrainersSearch
        handleLevel={handleLevel}
        handleGender={handleGender}
        handleLocation={handleLocation}
        handleClub={handleClub}
        handleTextSearch={handleTextSearch}
        handleClear={handleClear}
        trainerLevelId={trainerLevelId}
        gender={gender}
        locationId={locationId}
        clubId={clubId}
        textSearch={textSearch}
      />
      <PlayerTrainersResults
        playerTrainers={playerTrainers}
        handleTrainerPage={handleTrainerPage}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        user={user}
        currentPage={currentPage}
        refetchPlayerTrainers={refetchPlayerTrainers}
      />
    </div>
  );
};
export default PlayerTrainers;
