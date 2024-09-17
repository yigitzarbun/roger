import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";
import paths from "../../../../routing/Paths";

const TrainerStudents = () => {
  const { t } = useTranslation();

  return (
    <Link to={paths.STUDENTS} className={styles["trainer-students-container"]}>
      <h2>{t("trainerStudentsTitle")}</h2>
      <p>{t("trainerStudentsText")}</p>
      <button>{t("trainerViewStudentsButtonText")}</button>
    </Link>
  );
};

export default TrainerStudents;
