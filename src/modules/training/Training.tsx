import React, { useState, ChangeEvent } from "react";

import TrainingHero from "../../components/training/hero/TrainingHero";
import TrainSearch from "../../components/training/search/TrainSearch";
import TrainResults from "../../components/training/results/TrainResults";

import styles from "./styles.module.scss";

const Training = () => {
  const [level, setLevel] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");

  const handleLevel = (event: ChangeEvent<HTMLSelectElement>) => {
    setLevel(event.target.value);
  };
  const handleGender = (event: ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
  };
  const handleLocation = (event: ChangeEvent<HTMLSelectElement>) => {
    setLocation(event.target.value);
  };

  const handleClear = () => {
    setLevel("");
    setGender("");
    setLocation("");
  };
  return (
    <div className={styles["training-container"]}>
      <TrainingHero />
      <TrainSearch
        handleLevel={handleLevel}
        handleGender={handleGender}
        handleLocation={handleLocation}
        handleClear={handleClear}
      />
      <TrainResults level={level} gender={gender} location={location} />
    </div>
  );
};
export default Training;
