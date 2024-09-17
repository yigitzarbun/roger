import React from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import paths from "../../../../routing/Paths";

const PlayerMatch = () => {
  const { t } = useTranslation();

  return (
    <Link to={paths.MATCH} className={styles["player-match-container"]}>
      <h2>{t("matchTitle")}</h2>
      <p>{t("matchText")}</p>
      <button>{t("matchButtonText")}</button>
    </Link>
  );
};

export default PlayerMatch;
