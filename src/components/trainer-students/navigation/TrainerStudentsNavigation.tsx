import React from "react";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../store/hooks";

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
  const user = useAppSelector((store) => store?.user?.user?.user);

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
        Yeni Öğrenci Talepleri{" "}
        <span className={styles.notification}>
          {newStudentRequestsList?.length > 0 &&
            ` (${newStudentRequestsList?.length})`}
        </span>
      </button>
    </div>
  );
};

export default TrainerStudentsNavigation;
