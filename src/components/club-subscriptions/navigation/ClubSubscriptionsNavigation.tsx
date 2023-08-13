import React from "react";

import styles from "./styles.module.scss";

interface ClubSubscriptionsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const ClubSubscriptionsNavigation = ({
  display,
  handleDisplay,
}: ClubSubscriptionsNavigationProps) => {
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
        Üyelik Paketleri
      </button>
      <button
        onClick={() => handleDisplay("subscribers")}
        className={
          display === "subscribers"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Üyeler
      </button>
    </div>
  );
};

export default ClubSubscriptionsNavigation;
