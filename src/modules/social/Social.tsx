import React from "react";

import styles from "./styles.module.scss";
import { useAppSelector } from "../../store/hooks";
import PlayerSocial from "./player/PlayerSocial";

const Social = () => {
  const user = useAppSelector((store) => store?.user?.user);
  const isUserPlayer = user?.user?.user_type_id === 1;
  return (
    <div className={styles["social-container"]}>
      {isUserPlayer && <PlayerSocial />}
    </div>
  );
};

export default Social;
