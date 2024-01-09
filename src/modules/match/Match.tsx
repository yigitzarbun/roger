import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import MatchResults from "../../components/match/results/MatchResults";
import MatchSearch from "../../components/match/search/MatchSearch";

const Match = () => {
  const [playerLevelId, setPlayerLevelId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [favourite, setFavourite] = useState<boolean | null>(null);

  const handleLevel = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setPlayerLevelId(isNaN(value) ? null : value);
  };

  const handleLocation = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setLocationId(isNaN(value) ? null : value);
  };

  const handleFavourite = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    setFavourite(value);
  };

  const handleClear = () => {
    setPlayerLevelId(null);
    setLocationId(null);
    setFavourite(null);
  };
  return (
    <div className={styles["match-container"]}>
      <MatchSearch
        handleLevel={handleLevel}
        handleLocation={handleLocation}
        handleFavourite={handleFavourite}
        handleClear={handleClear}
        playerLevelId={playerLevelId}
        locationId={locationId}
        favourite={favourite}
      />
      <MatchResults
        playerLevelId={playerLevelId}
        locationId={locationId}
        favourite={favourite}
      />
    </div>
  );
};
export default Match;
