import React from "react";

import styles from "./styles.module.scss";

const PlayerRequests = () => {
  return (
    <div className={styles["request-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["request-title"]}>Yeni Davet</h2>
        <div className={styles["nav-container"]}>
          <p>Önceki</p>
          <p>Sonraki</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Oyuncu</th>
            <th>İsim</th>
            <th>Tür</th>
            <th>Tarih</th>
            <th>Saat</th>
            <th>Konum</th>
            <th>Takvim</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img
                src="/images/players/player1.png"
                className={styles["player-image"]}
              />
            </td>
            <td>Hasan Karayel</td>
            <td>Antreman</td>
            <td>21.12.2023</td>
            <td>19:00</td>
            <td>Enka Spor Tesisleri</td>
            <td>Müsait</td>
            <td>
              <button className={styles["accept-button"]}>Kabul et</button>
            </td>
            <td>
              <button className={styles["decline-button"]}>Reddet</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div></div>
    </div>
  );
};

export default PlayerRequests;
