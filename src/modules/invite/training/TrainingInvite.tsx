import React from "react";

import TrainingInviteForm from "../../../components/invite/training/form/TrainingInviteFormModal";

import styles from "./styles.module.scss";

const TrainingInvite = () => {
  return (
    <div className={styles["invite-container"]}>
      <TrainingInviteForm />
    </div>
  );
};
export default TrainingInvite;
