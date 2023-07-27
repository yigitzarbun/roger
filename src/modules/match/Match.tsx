import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import MatchHero from "../../components/match/hero/MatchHero";
import MatchResults from "../../components/match/results/MatchResults";
import MatchSearch from "../../components/match/search/MatchSearch";

const Match = () => {
  const [playerLevelId, setPlayerLevelId] = useState<number | null>(null);
  const [gender, setGender] = useState<string>("");
  const [locationId, setLocationId] = useState<number | null>(null);

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

  const handleClear = () => {
    setPlayerLevelId(null);
    setGender("");
    setLocationId(null);
  };
  return (
    <div className={styles["match-container"]}>
      <MatchHero />
      <MatchSearch
        handleLevel={handleLevel}
        handleGender={handleGender}
        handleLocation={handleLocation}
        handleClear={handleClear}
        playerLevelId={playerLevelId}
        gender={gender}
        locationId={locationId}
      />
      <MatchResults
        playerLevelId={playerLevelId}
        gender={gender}
        locationId={locationId}
      />
    </div>
  );
};
export default Match;
