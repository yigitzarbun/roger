import React from "react";

import styles from "./styles.module.scss";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";
import { useTranslation } from "react-i18next";

const ClubHomeCourts = () => {
  const { t } = useTranslation();

  return (
    <Link to={paths.CLUB_COURTS} className={styles["club-courts-container"]}>
      <h2>{t("courtsTitle")}</h2>
      <p>{t("courtsText")}</p>
      <button>{t("courtsButtonText")}</button>
    </Link>
  );
};

export default ClubHomeCourts;
