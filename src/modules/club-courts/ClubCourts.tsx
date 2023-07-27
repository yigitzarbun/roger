import React from "react";

import styles from "./styles.module.scss";

import ClubCourtseHero from "../../components/club-courts/hero/ClubCourtsHero";
import ClubCourtsSearch from "../../components/club-courts/club-courts-search/ClubCourtsSearch";
import ClubCourtsResults from "../../components/club-courts/club-courts-results/ClubCourtsResults";

const ClubCourts = () => {
  return (
    <div className={styles["club-courts-container"]}>
      <ClubCourtseHero />
      <ClubCourtsSearch />
      <ClubCourtsResults />
    </div>
  );
};
export default ClubCourts;
