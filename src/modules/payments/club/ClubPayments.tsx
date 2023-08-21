import React from "react";

import styles from "./styles.module.scss";

import ClubPaymentsHero from "../../../components/payments/club/hero/ClubPaymentsHero";
import ClubPaymentsResults from "../../../components/payments/club/results/ClubPaymentsResults";

const ClubPayments = () => {
  return (
    <div className={styles["club-payments-container"]}>
      <ClubPaymentsHero />
      <ClubPaymentsResults />
    </div>
  );
};

export default ClubPayments;
