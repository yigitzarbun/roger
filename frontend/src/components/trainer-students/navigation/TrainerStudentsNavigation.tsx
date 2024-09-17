import React from "react";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface TrainerStudentsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
  newStudentRequestsList: any[];
}

const TrainerStudentsNavigation = ({
  display,
  handleDisplay,
  newStudentRequestsList,
}: TrainerStudentsNavigationProps) => {
  const { t } = useTranslation();

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
        {t("trainerStudentsTitle")}
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
      <button
        onClick={() => handleDisplay("requests")}
        className={
          display === "requests"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        {t("newStudentRequestsTitle")}{" "}
        <span className={styles.notification}>
          {newStudentRequestsList?.length > 0 &&
            ` (${newStudentRequestsList?.length})`}
        </span>
      </button>
    </div>
  );
};

export default TrainerStudentsNavigation;
