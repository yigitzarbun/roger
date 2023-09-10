import React from "react";

import styles from "./styles.module.scss";
import i18n from "../../../../common/i18n/i18n";
import { Link } from "react-router-dom";
import paths from "../../../../routing/Paths";

const PlayerLesson = () => {
  return (
    <Link to={paths.LESSON} className={styles["player-lesson-container"]}>
      <h2>{i18n.t("lessonTitle")}</h2>
      <p>{i18n.t("lessonText")}</p>
      <button>{i18n.t("lessonButtonText")}</button>
    </Link>
  );
};

export default PlayerLesson;
