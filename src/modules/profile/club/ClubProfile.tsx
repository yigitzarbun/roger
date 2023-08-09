import React from "react";

import styles from "./styles.module.scss";
import ClubProfileHero from "../../../components/profile/club/hero/ClubProfileHero";
import ClubAccountDetails from "../../../components/profile/club/account-details/ClubAccountDetails";
import ClubBankAccountDetails from "../../../components/profile/club/bank-details/ClubBankAccountDetails";

const ClubProfile = () => {
  return (
    <div className={styles["club-profile-container"]}>
      <ClubProfileHero />
      <ClubAccountDetails />
      <ClubBankAccountDetails />
    </div>
  );
};

export default ClubProfile;
