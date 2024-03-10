import React from "react";

import styles from "./styles.module.scss";
import { Link } from "react-router-dom";
import paths from "../../../../routing/Paths";
import { useTranslation } from "react-i18next";

const PlayerTrain = () => {
  const { t } = useTranslation();
  return (
    <Link to={paths.TRAIN} className={styles["player-train-container"]}>
      <h2>{t("trainTitle")}</h2>
      <p>{t("trainText")}</p>
      <button>{t("trainButtonText")}</button>
    </Link>
  );
};

export default PlayerTrain;
