import React from "react";

import styles from "./styles.module.scss";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

const TrainerRequests = () => {
  return (
    <Link to={paths.REQUESTS} className={styles["trainer-requests-container"]}>
      <h2>Davetler</h2>
      <p>Gelen ve gönderilen ders davetlerini görüntüle</p>
      <button>Davetleri Görüntüle</button>
    </Link>
  );
};

export default TrainerRequests;
