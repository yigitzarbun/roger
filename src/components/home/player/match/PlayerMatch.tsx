import React from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";
import i18n from "../../../../common/i18n/i18n";
import paths from "../../../../routing/Paths";

const PlayerMatch = () => {
  return (
    <Link to={paths.MATCH} className={styles["player-match-container"]}>
      <h2>{i18n.t("matchTitle")}</h2>
      <p>{i18n.t("matchText")}</p>
      <button>{i18n.t("matchButtonText")}</button>
    </Link>
  );
};

export default PlayerMatch;
