import React from "react";

import styles from "./styles.module.scss";

interface TrainerStudentsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const TrainerStudentsNavigation = ({
  display,
  handleDisplay,
}: TrainerStudentsNavigationProps) => {
  return (
    <div className={styles["nav-container"]}>
      <button
        onClick={() => handleDisplay("students")}
        className={
          display === "students"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Öğrenciler
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
      <button
        onClick={() => handleDisplay("requests")}
        className={
          display === "requests"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Yeni Öğrenci Talepleri
      </button>
    </div>
  );
};

export default TrainerStudentsNavigation;
