import React from "react";

import styles from "./styles.module.scss";

import { useGetStudentsQuery } from "../../../api/endpoints/StudentsApi";
import { useAppSelector } from "../../../store/hooks";

interface TrainerStudentsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const TrainerStudentsNavigation = ({
  display,
  handleDisplay,
}: TrainerStudentsNavigationProps) => {
  const { data: students, isLoading: isStudentsLoading } = useGetStudentsQuery(
    {}
  );
  const user = useAppSelector((store) => store?.user?.user?.user);

  const newStudentRequests = students?.filter(
    (student) =>
      student.trainer_id === user?.user_id &&
      student.student_status === "pending"
  );

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
          ({newStudentRequests?.length > 0 && newStudentRequests.length})
        </span>
      </button>
    </div>
  );
};

export default TrainerStudentsNavigation;
