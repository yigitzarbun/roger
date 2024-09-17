import React from "react";

import styles from "./styles.module.scss";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";
import { useTranslation } from "react-i18next";

const ClubHomeSubscriptions = () => {
  const { t } = useTranslation();

  return (
    <Link
      to={paths.CLUB_SUBSCRIPTIONS}
      className={styles["club-subscriptions-container"]}
    >
      <h2>{t("subscriptionsTitle")}</h2>
      <p>{t("subscriptionsText")}</p>
      <button>{t("subscriptionsButtonText")}</button>
    </Link>
  );
};

export default ClubHomeSubscriptions;
