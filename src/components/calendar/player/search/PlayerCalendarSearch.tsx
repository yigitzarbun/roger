import styles from "./styles.module.scss";

const PlayerCalendarSearch = () => {
  return (
    <div className={styles["calendar-page-container"]}>
      <div className={styles["input-container"]}>
        <select>
          <option value="">-- Tarih --</option>
          <option value="today">Bugün</option>
          <option value="tomorrow">Yarın</option>
          <option value="week">Önümüzdeki 7 gün</option>
          <option value="month">Önümüzdeki 30 gün</option>
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select>
          <option value="">-- Tür --</option>
          <option value="training">Antreman</option>
          <option value="match">Maç</option>
          <option value="lesson">Ders</option>
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

export default PlayerCalendarSearch;
