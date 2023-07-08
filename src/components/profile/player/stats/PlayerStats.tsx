import styles from "./styles.module.scss";

const PlayerStats = () => {
  return (
    <div className={styles["player-stats-container"]}>
      <h2>Performans ve İstatistikler</h2>
      <p>Maç sayısı: 2</p>
      <p>Antreman sayısı: 14</p>
      <p>Ders sayısı: 32</p>
      <p>Toplam etkinlik: 48</p>
      <p>Sıralama: 81</p>
    </div>
  );
};

export default PlayerStats;
