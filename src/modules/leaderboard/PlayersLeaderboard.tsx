import React from "react";

import styles from "./styles.module.scss";

import PlayersLeaderboardResults from "../../components/leaderboard/leaderboard/PlayersLeaderboardResults";
import PlayersLeaderBoardHero from "../../components/leaderboard/hero/PlayersLeaderBoardHero";

const PlayersLeaderboard = () => {
  return (
    <div className={styles["leaderboard-container"]}>
      <PlayersLeaderBoardHero />
      <PlayersLeaderboardResults />
    </div>
  );
};

export default PlayersLeaderboard;
