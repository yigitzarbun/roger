import React from "react";

import styles from "./styles.module.scss";

import PlayerEventsHero from "../../../components/events/players/hero/PlayerEventsHero";
import PlayerEventsResults from "../../../components/events/players/results/PlayerEventsResults";

const PlayerEvents = () => {
  return (
    <div className={styles["player-events-container"]}>
      <PlayerEventsHero />
      <PlayerEventsResults />
    </div>
  );
};
export default PlayerEvents;
