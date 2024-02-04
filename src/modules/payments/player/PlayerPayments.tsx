import React from "react";

import styles from "./styles.module.scss";

import PlayerPaymentsResults from "../../../components/payments/player/results/PlayerPaymentsResults";

const PlayerPayments = () => {
  return (
    <div className={styles["player-payments-container"]}>
      <PlayerPaymentsResults />
    </div>
  );
};

export default PlayerPayments;
