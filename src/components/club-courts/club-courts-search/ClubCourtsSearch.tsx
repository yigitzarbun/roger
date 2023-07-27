import React from "react";

import styles from "./styles.module.scss";

const ClubCourtsSearch = () => {
  return (
    <div className={styles["courts-page-container"]}>
      <div className={styles["input-container"]}>
        <select>
          <option value="">-- Yüzey --</option>
          <option value="">-- Sert --</option>
          <option value="">-- Toprak --</option>
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select>
          <option value="">-- Mekan --</option>
          <option value="">Kapalı</option>
          <option value="">Açık</option>
        </select>
      </div>
      <div className={styles["price-input"]}>
        <label> {`Fiyat:  150 TL`}</label>
        <input
          type="range"
          id="trainerPrice"
          name="trainerPrice"
          min="0"
          max="750"
          defaultValue={100}
        />
      </div>
      <button className={styles["button"]}>Temizle</button>
    </div>
  );
};

export default ClubCourtsSearch;
