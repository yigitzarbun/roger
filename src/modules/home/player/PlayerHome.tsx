import { PlayerHomeHero } from "../../../components/player-home/hero/PlayerHomeHero";
import PlayerMatch from "../../../components/player-home/match/PlayerMatch";
import PlayerTrain from "../../../components/player-home/train/PlayerTrain";
import PlayerLesson from "../../../components/player-home/lesson/PlayerLesson";
import PlayerEquip from "../../../components/player-home/equip/PlayerEquip";

import styles from "./styles.module.scss";
import { PlayerRequests } from "../../../components/player-home/requests/PlayerRequests";

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
