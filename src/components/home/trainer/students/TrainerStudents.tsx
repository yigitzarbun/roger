import React from "react";

import styles from "./styles.module.scss";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

const TrainerStudents = () => {
  return (
    <Link to={paths.STUDENTS} className={styles["trainer-students-container"]}>
      <h2>Öğrenciler</h2>
      <p>Hesabına abone olan öğrencilerini görüntüle</p>
      <button>Öğrencilerini Görüntüle</button>
    </Link>
  );
};

export default TrainerStudents;
