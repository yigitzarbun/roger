import React from "react";

import styles from "./styles.module.scss";

import PlayerPaymentsHero from "../../../components/payments/player/hero/PlayerPaymentsHero";
import PlayerPaymentsResults from "../../../components/payments/player/results/PlayerPaymentsResults";

const PlayerPayments = () => {
  return (
    <div className={styles["player-payments-container"]}>
      <PlayerPaymentsHero />
      <PlayerPaymentsResults />
    </div>
  );
};

export default PlayerPayments;
