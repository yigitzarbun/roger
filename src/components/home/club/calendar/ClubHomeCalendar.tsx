import React from "react";

import styles from "./styles.module.scss";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

const ClubHomeCalendar = () => {
  return (
    <div className={styles["club-calendar-container"]}>
      <h2>Takvim</h2>
      <p>Onaylanmış rezervasyonları takip et</p>
      <Link to={paths.CALENDAR}>
        <button>Takvimi Görüntüle</button>
      </Link>
    </div>
  );
};

export default ClubHomeCalendar;
