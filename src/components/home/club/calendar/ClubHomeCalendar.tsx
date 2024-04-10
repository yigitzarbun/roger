import React from "react";

import styles from "./styles.module.scss";

import { useNavigate } from "react-router-dom";

import paths from "../../../../routing/Paths";
import { useTranslation } from "react-i18next";

const ClubHomeCalendar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(paths.CALENDAR);
  };

  return (
    <div onClick={handleNavigate} className={styles["club-calendar-container"]}>
      <h2>{t("calendarTitle")}</h2>
      <p>{t("calendarText")}</p>
      <button>{t("calendarButtonText")}</button>
    </div>
  );
};

export default ClubHomeCalendar;
