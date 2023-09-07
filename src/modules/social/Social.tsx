import React from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../store/hooks";

import PlayerSocial from "./player/PlayerSocial";
import TrainerSocial from "./trainer/TrainerSocial";

const Social = () => {
  const user = useAppSelector((store) => store?.user?.user);
  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;

  return (
    <div className={styles["social-container"]}>
      {isUserPlayer && <PlayerSocial />}
      {isUserTrainer && <TrainerSocial />}
    </div>
  );
};

export default Social;
