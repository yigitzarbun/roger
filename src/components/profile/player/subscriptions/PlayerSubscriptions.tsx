import React from "react";

import styles from "./styles.module.scss";

const PlayerSubscriptions = () => {
  return (
    <div className={styles["player-stats-container"]}>
      <h2>Üyelikler</h2>
      <p>Kulüp üyeliği: 2</p>
      <p>Eğitmen üyeliği: 14</p>
    </div>
  );
};

export default PlayerSubscriptions;
