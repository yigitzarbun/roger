import React from "react";

import styles from "./styles.module.scss";

import { useNavigate } from "react-router-dom";

import paths from "../../../../routing/Paths";
import { useTranslation } from "react-i18next";

const ClubHomeSubscriptions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(paths.CLUB_SUBSCRIPTIONS);
  };
  return (
    <div
      onClick={handleNavigate}
      className={styles["club-subscriptions-container"]}
    >
      <h2>{t("subscriptionsTitle")}</h2>
      <p>{t("subscriptionsText")}</p>
      <button>{t("subscriptionsButtonText")}</button>
    </div>
  );
};

export default ClubHomeSubscriptions;
