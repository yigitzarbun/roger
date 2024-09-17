import React from "react";
import styles from "./styles.module.scss";
import PlayerGroupResults from "../../components/player-groups/PlayerGroupsResults";

const PlayerGroups = () => {
  return (
    <div className={styles["groups-container"]}>
      <PlayerGroupResults />
    </div>
  );
};
export default PlayerGroups;
