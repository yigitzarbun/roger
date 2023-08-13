import React from "react";

import styles from "./styles.module.scss";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

const ClubHomeCourts = () => {
  return (
    <div className={styles["club-courts-container"]}>
      <h2>Kortlar</h2>
      <p>Kortlarını yönet ve yeni kort ekle</p>
      <Link to={paths.CLUB_COURTS}>
        <button>Kortları Görüntüle</button>
      </Link>
    </div>
  );
};

export default ClubHomeCourts;
