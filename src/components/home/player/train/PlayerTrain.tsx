import styles from "./styles.module.scss";
import i18n from "../../../../common/i18n/i18n";
import { Link } from "react-router-dom";
import paths from "../../../../routing/Paths";

const PlayerTrain = () => {
  return (
    <div className={styles["player-train-container"]}>
      <h2>{i18n.t("trainTitle")}</h2>
      <p>{i18n.t("trainText")}</p>
      <Link to={paths.TRAIN}>
        <button>{i18n.t("trainButtonText")}</button>
      </Link>
    </div>
  );
};

export default PlayerTrain;