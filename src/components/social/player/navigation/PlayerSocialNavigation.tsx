import React from "react";

import styles from "./styles.module.scss";

interface PlayerSocialNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const PlayerSocialNavigation = ({
  display,
  handleDisplay,
}: PlayerSocialNavigationProps) => {
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
        Üyelikler
      </button>
      <button
        onClick={() => handleDisplay("favourites")}
        className={
          display === "favourites"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Favoriler
      </button>
      <button
        onClick={() => handleDisplay("groups")}
        className={
          display === "groups"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Gruplar
      </button>
    </div>
  );
};

export default PlayerSocialNavigation;
