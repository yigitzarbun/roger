import React from "react";

import PlayerHomeHero from "../../../components/home/player/hero/PlayerHomeHero";
import PlayerMatch from "../../../components/home/player/match/PlayerMatch";
import PlayerTrain from "../../../components/home/player/train/PlayerTrain";
import PlayerLesson from "../../../components/home/player/lesson/PlayerLesson";
import PlayerEquip from "../../../components/home/player/equip/PlayerEquip";
import PlayerRequests from "../../../components/home/player/requests/PlayerRequests";

import styles from "./styles.module.scss";

const PlayerHome = () => {
  return (
    <div className={styles["player-home-container"]}>
      <PlayerHomeHero />
      <PlayerRequests />
      <div className={styles["top-container"]}>
        <PlayerTrain />
        <PlayerMatch />
      </div>
      <div className={styles["mid-container"]}>
        <PlayerLesson />
        <PlayerEquip />
      </div>
    </div>
  );
};
export default PlayerHome;
