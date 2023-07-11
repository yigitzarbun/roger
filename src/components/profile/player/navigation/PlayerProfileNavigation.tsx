import React from "react";

import styles from "./styles.module.scss";

interface PlayerRequestsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const PlayerProfileNavigation = ({
  display,
  handleDisplay,
}: PlayerRequestsNavigationProps) => {
  return (
    <div className={styles["nav-container"]}>
      <button
        onClick={() => handleDisplay("account-details")}
        className={
          display === "account-details"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Hesap Bilgileri
      </button>
      <button
        onClick={() => handleDisplay("card-payments")}
        className={
          display === "card-payments"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Ödeme ve Kart
      </button>
      <button
        onClick={() => handleDisplay("stats")}
        className={
          display === "stats"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Performans ve İstatistikler
      </button>
    </div>
  );
};

export default PlayerProfileNavigation;
