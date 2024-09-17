import React from "react";

import styles from "./styles.module.scss";

import { useNavigate } from "react-router-dom";

import paths from "../../../../routing/Paths";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ClubHomeCalendar = () => {
  const { t } = useTranslation();

  return (
    <Link to={paths.CALENDAR} className={styles["club-calendar-container"]}>
      <h2>{t("calendarTitle")}</h2>
      <p>{t("calendarText")}</p>
      <button>{t("calendarButtonText")}</button>
    </Link>
  );
};

export default ClubHomeCalendar;
