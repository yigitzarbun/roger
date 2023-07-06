import styles from "./styles.module.scss";

const MatchSearch = () => {
  return (
    <div className={styles["match-page-container"]}>
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
          <option value="">-- Yaş --</option>
          <option value="junior">12 - 15</option>
          <option value="young">16 - 20</option>
          <option value="young-adult">21 - 30</option>
          <option value="mid-adult">31 - 40</option>
          <option value="upper-senior">41 - 50</option>
          <option value="senior">50+</option>
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select>
          <option value="">-- Değerlendirme --</option>
          <option value="1">1 / 5</option>
          <option value="2">2 / 5</option>
          <option value="3">3 / 5</option>
          <option value="4">4 / 5</option>
          <option value="5">5 / 5</option>
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

export default MatchSearch;
