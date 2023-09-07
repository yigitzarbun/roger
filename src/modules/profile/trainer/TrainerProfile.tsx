import React from "react";

import styles from "./styles.module.scss";
import TrainerProfileHero from "../../../components/profile/trainer/hero/TrainerProfileHero";
import TrainerAccountDetails from "../../../components/profile/trainer/account-details/TrainerAccountDetails";
import TrainerBankAccountDetails from "../../../components/profile/trainer/bank-details/TrainerBankAccountDetails";
import TrainerStats from "../../../components/profile/trainer/stats/TrainerStats";
import TrainerFavourites from "../../../components/profile/trainer/favourites/TrainerFavourites";

const TrainerProfile = () => {
  return (
    <div className={styles["trainer-profile-container"]}>
      <TrainerProfileHero />
      <TrainerAccountDetails />
      <TrainerBankAccountDetails />
      <TrainerStats />
      <TrainerFavourites />
    </div>
  );
};

export default TrainerProfile;
