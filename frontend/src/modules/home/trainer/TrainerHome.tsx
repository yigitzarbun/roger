import React from "react";

import styles from "./styles.module.scss";

import TrainerHomeHero from "../../../components/home/trainer/hero/TrainerHomeHero";
import TrainerRequests from "../../../components/home/trainer/requests/TrainerRequests";
import TrainerCalendar from "../../../components/home/trainer/calendar/TrainerCalendar";
import TrainerStudents from "../../../components/home/trainer/students/TrainerStudents";
import TrainerEquip from "../../../components/home/trainer/equip/TrainerEquip";

const TrainerHome = () => {
  return (
    <div className={styles["trainer-home-container"]}>
      <TrainerHomeHero />
      <div className={styles["top-container"]}>
        <TrainerRequests />
        <TrainerCalendar />
        <TrainerStudents />
        <TrainerEquip />
      </div>
    </div>
  );
};
export default TrainerHome;
