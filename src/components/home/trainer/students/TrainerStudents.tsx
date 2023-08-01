import React from "react";

import styles from "./styles.module.scss";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

const TrainerStudents = () => {
  return (
    <div className={styles["trainer-students-container"]}>
      <h2>Öğrenciler</h2>
      <p>Hesabına abone olan öğrencilerini görüntüle</p>
      <Link to={paths.STUDENTS}>
        <button>Öğrencilerini Görüntüle</button>
      </Link>
    </div>
  );
};

export default TrainerStudents;
