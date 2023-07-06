import styles from "./styles.module.scss";

const LessonSeach = () => {
  return (
    <div className={styles["lesson-page-container"]}>
      <div className={styles["input-container"]}>
        <select>
          <option value="">-- Tecrübe --</option>
          <option value="beginner">1 - 5 yıl</option>
          <option value="intermediate">5 - 10 yıl</option>
          <option value="advanced">11 - 15 yıl</option>
          <option value="professional">20 yıl +</option>
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
      <div className={styles["input-container"]}>
        <select>
          <option value="">-- Fiyat --</option>
          <option value="low">100 - 150 TL / saat</option>
          <option value="mid">150 - 300 TL / saat</option>
          <option value="premium">300 - 500 TL / saat</option>
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select>
          <option value="">-- Değerlendirme --</option>
          <option value="low">1 / 5</option>
          <option value="mid">2 / 5</option>
          <option value="premium">3 / 5</option>
          <option value="premium">4 / 5</option>
          <option value="premium">5 / 5</option>
        </select>
      </div>
      <button type="submit" className={styles["button"]}>
        Temizle
      </button>
    </div>
  );
};

export default LessonSeach;
