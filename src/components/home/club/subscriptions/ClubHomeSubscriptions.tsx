import React from "react";

import styles from "./styles.module.scss";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";
import { useTranslation } from "react-i18next";

const ClubHomeSubscriptions = () => {
  const { t } = useTranslation();

  return (
    <div className={styles["club-subscriptions-container"]}>
      <h2>{t("subscriptionsTitle")}</h2>
      <p>{t("subscriptionsText")}</p>
      <Link to={paths.CLUB_SUBSCRIPTIONS}>
        <button>{t("subscriptionsButtonText")}</button>
      </Link>
    </div>
  );
};

export default ClubHomeSubscriptions;
