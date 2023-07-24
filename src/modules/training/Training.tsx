import React, { useState, ChangeEvent } from "react";

import TrainingHero from "../../components/training/hero/TrainingHero";
import TrainSearch from "../../components/training/search/TrainSearch";
import TrainResults from "../../components/training/results/TrainResults";

import styles from "./styles.module.scss";

const Training = () => {
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
    <div className={styles["training-container"]}>
      <TrainingHero />
      <TrainSearch
        handleLevel={handleLevel}
        handleGender={handleGender}
        handleLocation={handleLocation}
        handleClear={handleClear}
        playerLevelId={playerLevelId}
        gender={gender}
        locationId={locationId}
      />
      <TrainResults
        playerLevelId={playerLevelId}
        gender={gender}
        locationId={locationId}
      />
    </div>
  );
};
export default Training;
