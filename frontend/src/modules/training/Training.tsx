import React, { useState, ChangeEvent } from "react";

import TrainSearch from "../../components/training/search/TrainSearch";
import TrainResults from "../../components/training/results/TrainResults";

import styles from "./styles.module.scss";

const Training = () => {
  const [textSearch, setTextSearch] = useState<string>("");
  const [playerLevelId, setPlayerLevelId] = useState<number | null>(null);
  const [gender, setGender] = useState<string>("");
  const [locationId, setLocationId] = useState<number | null>(null);
  const [favourite, setFavourite] = useState<boolean | null>(false);

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const handleGender = (event: ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
  };

  const handleLevel = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setPlayerLevelId(isNaN(value) ? null : value);
  };

  const handleLocation = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setLocationId(isNaN(value) ? null : value);
  };

  const handleFavourite = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFavourite(value === "true");
  };

  const [filterOpen, setFilterOpen] = useState(false);

  const handleOpenFilter = () => {
    filterOpen ? setFilterOpen(false) : setFilterOpen(true);
  };

  const handleClear = () => {
    setTextSearch("");
    setPlayerLevelId(null);
    setGender("");
    setLocationId(null);
    setFavourite(false);
  };

  return (
    <div className={styles["training-container"]}>
      {filterOpen && (
        <TrainSearch
          handleLevel={handleLevel}
          handleTextSearch={handleTextSearch}
          handleGender={handleGender}
          handleLocation={handleLocation}
          handleFavourite={handleFavourite}
          playerLevelId={playerLevelId}
          textSearch={textSearch}
          gender={gender}
          locationId={locationId}
          favourite={favourite}
          handleClear={handleClear}
        />
      )}

      <TrainResults
        playerLevelId={playerLevelId}
        textSearch={textSearch}
        gender={gender}
        locationId={locationId}
        favourite={favourite}
        handleOpenFilter={handleOpenFilter}
      />
    </div>
  );
};
export default Training;
