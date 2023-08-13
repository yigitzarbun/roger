import React from "react";

import styles from "./styles.module.scss";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

const ClubHomeSubscriptions = () => {
  return (
    <div className={styles["club-subscriptions-container"]}>
      <h2>Üyelikler</h2>
      <p>
        Üyelik paketlerini yönet ve yeni üyelik paketi ekle. Üyelerini
        görüntüle.
      </p>
      <Link to={paths.CLUB_SUBSCRIPTIONS}>
        <button>Üyelikleri Görüntüle</button>
      </Link>
    </div>
  );
};

export default ClubHomeSubscriptions;
