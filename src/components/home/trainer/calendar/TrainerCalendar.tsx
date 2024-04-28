import React from "react";

import styles from "./styles.module.scss";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

const TrainerCalendar = () => {
  return (
    <Link to={paths.CALENDAR} className={styles["trainer-calendar-container"]}>
      <h2>Takvim</h2>
      <p>Onaylanmış derslerini takip et</p>
      <button>Takvimi Görüntüle</button>
    </Link>
  );
};

export default TrainerCalendar;
