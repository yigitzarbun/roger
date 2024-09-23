import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

const PlayerGender = (props) => {
  const { playerDetails } = props;

  const { t } = useTranslation();

  return (
    <div className={styles["player-account-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>{t("tableGenderHeader")}</h4>
        <p>{t("genderText")}</p>
        <p>
          {t("genderText2")}{" "}
          <span className={styles.email}>merhaba@raketgo.com</span>
        </p>
      </div>
      <p className={styles.gender}>{playerDetails?.gender}</p>
    </div>
  );
};

export default PlayerGender;
