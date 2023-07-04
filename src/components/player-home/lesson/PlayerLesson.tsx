import styles from "./styles.module.scss";
import i18n from "../../../common/i18n/i18n";
import { Link } from "react-router-dom";
import paths from "../../../routing/Paths";

const PlayerLesson = () => {
  return (
    <div className={styles["player-lesson-container"]}>
      <h2>{i18n.t("lessonTitle")}</h2>
      <p>{i18n.t("lessonText")}</p>
      <Link to={paths.LESSON}>
        <button>{i18n.t("lessonButtonText")}</button>
      </Link>
    </div>
  );
};

export default PlayerLesson;
