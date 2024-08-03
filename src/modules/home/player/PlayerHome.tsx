import React from "react";

import styles from "./styles.module.scss";

import PlayerHomeHero from "../../../components/home/player/hero/PlayerHomeHero";
import PlayerMatch from "../../../components/home/player/match/PlayerMatch";
import PlayerTrain from "../../../components/home/player/train/PlayerTrain";
import PlayerLesson from "../../../components/home/player/lesson/PlayerLesson";
import PlayerEquip from "../../../components/home/player/equip/PlayerEquip";
import PlayerHomeLeaderboard from "../../../components/home/player/leaderboard/PlayerHomeLeaderboard";

const PlayerHome = () => {
  return (
    <div className={styles["player-home-container"]}>
      <PlayerHomeHero />
      <div className={styles["top-container"]}>
        <PlayerTrain />
        <PlayerMatch />
        <PlayerLesson />
        <PlayerEquip />
      </div>
      <PlayerHomeLeaderboard />
    </div>
  );
};
export default PlayerHome;
