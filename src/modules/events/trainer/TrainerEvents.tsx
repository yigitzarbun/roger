import React from "react";

import styles from "./styles.module.scss";

import TrainerEventsHero from "../../../components/events/trainers/hero/TrainerEventsHero";
import TrainerEventsResults from "../../../components/events/trainers/results/TrainerEventsResults";

const TrainerEvents = () => {
  return (
    <div className={styles["trainer-events-container"]}>
      <TrainerEventsHero />
      <TrainerEventsResults />
    </div>
  );
};

export default TrainerEvents;
