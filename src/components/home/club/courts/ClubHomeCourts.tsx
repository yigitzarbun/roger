import React from "react";

import styles from "./styles.module.scss";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";
import { useTranslation } from "react-i18next";

const ClubHomeCourts = () => {
  const { t } = useTranslation();

  return (
    <div className={styles["club-courts-container"]}>
      <h2>{t("courtsTitle")}</h2>
      <p>{t("courtsText")}</p>
      <Link to={paths.CLUB_COURTS}>
        <button>{t("courtsButtonText")}</button>
      </Link>
    </div>
  );
};

export default ClubHomeCourts;
