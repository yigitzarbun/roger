import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";
import paths from "../../../../routing/Paths";

const TrainerCalendar = () => {
  const { t } = useTranslation();

  return (
    <Link to={paths.CALENDAR} className={styles["trainer-calendar-container"]}>
      <h2>{t("calendarTitle")}</h2>
      <p>{t("trainerCalendarText")}</p>
      <button>{t("calendarButtonText")}</button>
    </Link>
  );
};

export default TrainerCalendar;
