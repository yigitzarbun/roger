import React from "react";

import styles from "./styles.module.scss";

import TrainerPaymentsHero from "../../../components/payments/trainer/hero/TrainerPaymentsHero";
import TrainerPaymentsResults from "../../../components/payments/trainer/results/TrainerPaymentsResults";

const TrainerPayments = () => {
  return (
    <div className={styles["trainer-payments-container"]}>
      <TrainerPaymentsHero />
      <TrainerPaymentsResults />
    </div>
  );
};

export default TrainerPayments;
