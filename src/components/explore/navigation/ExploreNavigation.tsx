import React from "react";

import styles from "./styles.module.scss";

interface ExploreNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const ExploreNavigation = ({
  display,
  handleDisplay,
}: ExploreNavigationProps) => {
  return (
    <div className={styles["nav-container"]}>
      <button
        onClick={() => handleDisplay("players")}
        className={
          display === "players"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Oyuncular
      </button>
      <button
        onClick={() => handleDisplay("trainers")}
        className={
          display === "trainers"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Eğitmenler
      </button>
      <button
        onClick={() => handleDisplay("clubs")}
        className={
          display === "clubs"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Kulüpler
      </button>
      <button
        onClick={() => handleDisplay("courts")}
        className={
          display === "courts"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Kortlar
      </button>
    </div>
  );
};

export default ExploreNavigation;
