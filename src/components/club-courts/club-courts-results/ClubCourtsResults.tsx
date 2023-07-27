import React from "react";
import styles from "./styles.module.scss";

const ClubCourtsResults = () => {
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Kortlar</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Kort</th>
            <th>Kort Adı</th>
            <th>Yüzey</th>
            <th>Mekan</th>
            <th>Açılış</th>
            <th>Kapanış</th>
            <th>Fiyat (saat / TL)</th>
          </tr>
        </thead>
        <tbody>
          <tr className={styles["court-row"]}>
            <td>
              <img
                src="/images/icons/avatar.png"
                alt="kort"
                className={styles["court-image"]}
              />
            </td>
            <td>Merkez</td>
            <td>Toprak</td>
            <td>Kapalı</td>
            <td>08:00</td>
            <td>22:00</td>
            <td>120 TL</td>
            <td>Düzenle</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ClubCourtsResults;
