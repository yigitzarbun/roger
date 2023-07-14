import React, { ChangeEvent } from "react";

import styles from "./styles.module.scss";

interface MatchSearchProps {
  handleLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleGender: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
  level: string;
  gender: string;
  location: string;
}

const MatchSearch = (props: MatchSearchProps) => {
  const {
    handleLevel,
    handleGender,
    handleLocation,
    handleClear,
    level,
    gender,
    location,
  } = props;
  return (
    <div className={styles["match-page-container"]}>
      <div className={styles["input-container"]}>
        <select onChange={handleLevel} value={level}>
          <option value="">-- Seviye --</option>
          <option value="beginner">Başlangıç</option>
          <option value="intermediate">Orta</option>
          <option value="advanced">İleri</option>
          <option value="professional">Profesyonel</option>
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleGender} value={gender}>
          <option value="">-- Cinsiyet --</option>
          <option value="female">Kadın</option>
          <option value="male">Erkek</option>
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleLocation} value={location}>
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

export default MatchSearch;
