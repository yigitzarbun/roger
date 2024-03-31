import React from "react";
import MatchInviteForm from "../../../components/invite/match/form/MatchInviteFormModal";

import styles from "./styles.module.scss";

const MatchInivte = () => {
  return (
    <div className={styles["invite-container"]}>
      <MatchInviteForm />
    </div>
  );
};

export default MatchInivte;
