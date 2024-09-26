import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

interface ClubSubscriptionsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const ClubSubscriptionsNavigation = ({
  display,
  handleDisplay,
}: ClubSubscriptionsNavigationProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles["nav-container"]}>
      <button
        onClick={() => handleDisplay("subscriptions")}
        className={
          display === "subscriptions"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        {t("subscriptionPackages")}
      </button>
      <button
        onClick={() => handleDisplay("subscribers")}
        className={
          display === "subscribers"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        {t("subscribersTitle")}
      </button>
      <button
        onClick={() => handleDisplay("groups")}
        className={
          display === "groups"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        {t("groups")}
      </button>
    </div>
  );
};

export default ClubSubscriptionsNavigation;
