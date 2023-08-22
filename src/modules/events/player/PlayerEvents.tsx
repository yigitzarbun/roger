import React, { useState } from "react";

import styles from "./styles.module.scss";

import PlayerEventsHero from "../../../components/events/players/hero/PlayerEventsHero";
import PlayerEventsNavigation from "../../../components/events/players/navigation/PlayerEventsNavigation";
import PlayerPastEventsResults from "../../../components/events/players/results/PlayerPastEventsResults";
import PlayerScores from "../../../components/events/players/scores/PlayerScores";

const PlayerEvents = () => {
  const [display, setDisplay] = useState("events");

  const handleDisplay = (value: string) => {
    setDisplay(value);
  };

  return (
    <div className={styles["player-events-container"]}>
      <PlayerEventsHero />
      <PlayerEventsNavigation display={display} handleDisplay={handleDisplay} />
      {display === "events" && <PlayerPastEventsResults />}
      {display === "scores" && <PlayerScores />}
    </div>
  );
};
export default PlayerEvents;
