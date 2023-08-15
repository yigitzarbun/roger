import React from "react";

import styles from "./styles.module.scss";
import ClubProfileHero from "../../../components/profile/club/hero/ClubProfileHero";
import ClubAccountDetails from "../../../components/profile/club/account-details/ClubAccountDetails";
import ClubBankAccountDetails from "../../../components/profile/club/bank-details/ClubBankAccountDetails";
import ClubRules from "../../../components/profile/club/club-rules/ClubRules";

const ClubProfile = () => {
  return (
    <div className={styles["club-profile-container"]}>
      <ClubProfileHero />
      <ClubAccountDetails />
      <ClubBankAccountDetails />
      <ClubRules />
    </div>
  );
};

export default ClubProfile;
