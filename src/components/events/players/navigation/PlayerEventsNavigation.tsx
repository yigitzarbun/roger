import React from "react";

import styles from "./styles.module.scss";

interface PlayerEventsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const PlayerEventsNavigation = ({
  display,
  handleDisplay,
}: PlayerEventsNavigationProps) => {
  return (
    <div className={styles["nav-container"]}>
      <button
        onClick={() => handleDisplay("events")}
        className={
          display === "events"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Geçmiş Etkinlikler
      </button>
      <button
        onClick={() => handleDisplay("scores")}
        className={
          display === "scores"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Skorlar
      </button>
    </div>
  );
};

export default PlayerEventsNavigation;
