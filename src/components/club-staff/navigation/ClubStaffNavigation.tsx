import React from "react";

import styles from "./styles.module.scss";

interface ClubStaffNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const ClubStaffNavigation = ({
  display,
  handleDisplay,
}: ClubStaffNavigationProps) => {
  return (
    <div className={styles["nav-container"]}>
      <button
        onClick={() => handleDisplay("staff")}
        className={
          display === "staff"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Personel
      </button>
      <button
        onClick={() => handleDisplay("requests")}
        className={
          display === "requests"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Başvurular
      </button>
    </div>
  );
};

export default ClubStaffNavigation;
