import React from "react";

import styles from "./styles.module.scss";

const TrainSearch = () => {
  return (
    <div className={styles["training-page-container"]}>
      <div className={styles["input-container"]}>
        <select>
          <option value="">-- Seviye --</option>
          <option value="beginner">Başlangıç</option>
          <option value="intermediate">Orta</option>
          <option value="advanced">İleri</option>
          <option value="professional">Profesyonel</option>
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select>
          <option value="">-- Cinsiyet --</option>
          <option value="female">Kadın</option>
          <option value="male">Erkek</option>
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select>
          <option value="">-- Konum --</option>
          <option value="atasehir">Ataşehir</option>
          <option value="kadikoy">Kadıköy</option>
          <option value="kartal">Kartal</option>
          <option value="maltepe">Maltepe</option>
        </select>
      </div>
      <button type="submit" className={styles["button"]}>
        Temizle
      </button>
    </div>
  );
};

export default TrainSearch;
