import React from "react";

import styles from "./styles.module.scss";

interface TrainerRequestsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const TrainerRequestsNavigation = ({
  display,
  handleDisplay,
}: TrainerRequestsNavigationProps) => {
  return (
    <div className={styles["nav-container"]}>
      <button
        onClick={() => handleDisplay("outgoing")}
        className={
          display === "outgoing"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Gönderilen Davetler
      </button>
      <button
        onClick={() => handleDisplay("incoming")}
        className={
          display === "incoming"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Gelen Davetler
      </button>
    </div>
  );
};

export default TrainerRequestsNavigation;
