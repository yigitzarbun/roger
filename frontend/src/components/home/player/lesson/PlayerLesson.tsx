import React from "react";

import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import paths from "../../../../routing/Paths";

const PlayerLesson = () => {
  const { t } = useTranslation();

  return (
    <Link to={paths.LESSON} className={styles["player-lesson-container"]}>
      <h2>{t("lessonTitle")}</h2>
      <p>{t("lessonText")}</p>
      <button>{t("lessonButtonText")}</button>
    </Link>
  );
};

export default PlayerLesson;
