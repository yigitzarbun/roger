import React from "react";

import styles from "./styles.module.scss";
import TrainerProfileHero from "../../../components/profile/trainer/hero/TrainerProfileHero";
import TrainerAccountDetails from "../../../components/profile/trainer/account-details/TrainerAccountDetails";
import TrainerBankAccountDetails from "../../../components/profile/trainer/bank-details/TrainerBankAccountDetails";

const TrainerProfile = () => {
  return (
    <div className={styles["trainer-profile-container"]}>
      <TrainerProfileHero />
      <TrainerAccountDetails />
      <TrainerBankAccountDetails />
    </div>
  );
};

export default TrainerProfile;
