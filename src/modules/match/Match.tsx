import React, { useState, ChangeEvent } from "react";

import styles from "./styles.module.scss";

import MatchHero from "../../components/match/hero/MatchHero";
import MatchResults from "../../components/match/results/MatchResults";
import MatchSearch from "../../components/match/search/MatchSearch";

const Match = () => {
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
    <div className={styles["match-container"]}>
      <MatchHero />
      <MatchSearch
        handleLevel={handleLevel}
        handleGender={handleGender}
        handleLocation={handleLocation}
        handleClear={handleClear}
        level={level}
        gender={gender}
        location={location}
      />
      <MatchResults level={level} gender={gender} location={location} />
    </div>
  );
};
export default Match;
