import React, { ChangeEvent } from "react";

import styles from "./styles.module.scss";

interface TrainSearchProps {
  handleLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleGender: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
}
const TrainSearch = (props: TrainSearchProps) => {
  const { handleLevel, handleGender, handleLocation, handleClear } = props;
  return (
    <div className={styles["training-page-container"]}>
      <div className={styles["input-container"]}>
        <select onChange={handleLevel}>
          <option value="">-- Seviye --</option>
          <option value="beginner">Başlangıç</option>
          <option value="intermediate">Orta</option>
          <option value="advanced">İleri</option>
          <option value="professional">Profesyonel</option>
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleGender}>
          <option value="">-- Cinsiyet --</option>
          <option value="female">Kadın</option>
          <option value="male">Erkek</option>
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleLocation}>
          <option value="">-- Konum --</option>
          <option value="atasehir">Ataşehir</option>
          <option value="kadikoy">Kadıköy</option>
          <option value="kartal">Kartal</option>
          <option value="maltepe">Maltepe</option>
        </select>
      </div>
      <button onClick={handleClear} className={styles["button"]}>
        Temizle
      </button>
    </div>
  );
};

export default TrainSearch;
