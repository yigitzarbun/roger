import React from "react";

import styles from "./styles.module.scss";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";
import { useTranslation } from "react-i18next";

const ClubHomeCalendar = () => {
  const { t } = useTranslation();

  return (
    <div className={styles["club-calendar-container"]}>
      <h2>{t("calendarTitle")}</h2>
      <p>{t("calendarText")}</p>
      <Link to={paths.CALENDAR}>
        <button>{t("calendarButtonText")}</button>
      </Link>
    </div>
  );
};

export default ClubHomeCalendar;
