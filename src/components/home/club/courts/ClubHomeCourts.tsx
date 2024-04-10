import React from "react";

import styles from "./styles.module.scss";

import { useNavigate } from "react-router-dom";

import paths from "../../../../routing/Paths";
import { useTranslation } from "react-i18next";

const ClubHomeCourts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(paths.CLUB_COURTS);
  };
  return (
    <div onClick={handleNavigate} className={styles["club-courts-container"]}>
      <h2>{t("courtsTitle")}</h2>
      <p>{t("courtsText")}</p>
      <button>{t("courtsButtonText")}</button>
    </div>
  );
};

export default ClubHomeCourts;
