import React from "react";

import ClubHomeHero from "../../../components/home/club/hero/ClubHomeHero";
import ClubEquip from "../../../components/home/club/equip/ClubEquip";
import ClubHomeCalendar from "../../../components/home/club/calendar/ClubHomeCalendar";
import ClubHomeCourts from "../../../components/home/club/courts/ClubHomeCourts";
import ClubSubscriptions from "../../../components/home/club/subscriptions/ClubHomeSubscriptions";

import styles from "./styles.module.scss";

const ClubHome = () => {
  return (
    <div className={styles["club-home-container"]}>
      <ClubHomeHero />
      <div className={styles["top-container"]}>
        <ClubHomeCalendar />
        <ClubHomeCourts />
      </div>
      <div className={styles["mid-container"]}>
        <ClubSubscriptions />
        <ClubEquip />
      </div>
    </div>
  );
};
export default ClubHome;
