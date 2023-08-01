import React from "react";

import styles from "./styles.module.scss";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

const TrainerRequests = () => {
  return (
    <div className={styles["trainer-requests-container"]}>
      <h2>Davetler</h2>
      <p>Gelen ve gönderilen ders davetlerini görüntüle</p>
      <Link to={paths.REQUESTS}>
        <button>Davetleri Görüntüle</button>
      </Link>
    </div>
  );
};

export default TrainerRequests;
