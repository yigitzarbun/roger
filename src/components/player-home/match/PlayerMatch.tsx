import { Link } from "react-router-dom";

import styles from "./styles.module.scss";
import i18n from "../../../common/i18n/i18n";
import paths from "../../../routing/Paths";

const PlayerMatch = () => {
  return (
    <div className={styles["player-match-container"]}>
      <h2>{i18n.t("matchTitle")}</h2>
      <p>{i18n.t("matchText")}</p>
      <Link to={paths.MATCH}>
        <button>{i18n.t("matchButtonText")}</button>
      </Link>
    </div>
  );
};

export default PlayerMatch;
