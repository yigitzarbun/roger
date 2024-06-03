import React, { useState } from "react";
import styles from "./styles.module.scss";
import PlayerTournamentsNavigation from "../../components/player-tournaments/navigation/PlayerTournamentsNavigation";
import AllTournaments from "../../components/player-tournaments/all-tournaments/AllTournaments";

const Tournaments = () => {
  const [display, setDisplay] = useState("all-tournaments");
  const handleDisplay = (value: string) => {
    setDisplay(value);
  };
  return (
    <div className={styles["tournaments-container"]}>
      <PlayerTournamentsNavigation
        display={display}
        handleDisplay={handleDisplay}
      />
      {display === "all-tournaments" && <AllTournaments />}
    </div>
  );
};

export default Tournaments;
