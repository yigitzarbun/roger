import React from "react";

import TrainingInviteForm from "../../../components/invite/training/form/TrainingForm";
import TrainingHero from "../../../components/training/hero/TrainingHero";

import styles from "./styles.module.scss";

const TrainingInvite = () => {
  return (
    <div className={styles["invite-container"]}>
      <TrainingHero />
      <TrainingInviteForm />
    </div>
  );
};
export default TrainingInvite;
