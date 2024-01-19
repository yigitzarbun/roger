import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import MatchResults from "../../components/match/results/MatchResults";
import MatchSearch from "../../components/match/search/MatchSearch";

const Match = () => {
  const [textSearch, setTextSearch] = useState<string>("");
  const [playerLevelId, setPlayerLevelId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [favourite, setFavourite] = useState<boolean | null>(false);

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
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

  const handleClear = () => {
    setPlayerLevelId(null);
    setLocationId(null);
    setFavourite(null);
  };
  return (
    <div className={styles["match-container"]}>
      <MatchSearch
        handleLevel={handleLevel}
        handleTextSearch={handleTextSearch}
        handleLocation={handleLocation}
        handleFavourite={handleFavourite}
        playerLevelId={playerLevelId}
        textSearch={textSearch}
        locationId={locationId}
        favourite={favourite}
      />
      <MatchResults
        playerLevelId={playerLevelId}
        textSearch={textSearch}
        locationId={locationId}
        favourite={favourite}
      />
    </div>
  );
};
export default Match;
