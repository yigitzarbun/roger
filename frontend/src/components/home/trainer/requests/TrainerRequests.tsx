import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";
import paths from "../../../../routing/Paths";

const TrainerRequests = () => {
  const { t } = useTranslation();

  return (
    <Link to={paths.REQUESTS} className={styles["trainer-requests-container"]}>
      <h2>{t("headerInvitesTitle")}</h2>
      <p>{t("trainerRequestsText")}</p>
      <button>{t("trainerViewRequestsButtonText")}</button>
    </Link>
  );
};

export default TrainerRequests;
