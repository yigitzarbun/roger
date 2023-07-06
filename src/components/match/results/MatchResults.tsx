import styles from "./styles.module.scss";

const MatchResults = () => {
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Maç</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Oyuncu</th>
            <th>İsim</th>
            <th>Seviye</th>
            <th>Cinsiyet</th>
            <th>Yaş</th>
            <th>Konum</th>
            <th>Değerlendirme</th>
          </tr>
        </thead>
        <tbody>
          <tr className={styles["player-row"]}>
            <td>
              <img
                src="/images/players/player1.png"
                className={styles["player-image"]}
              />
            </td>
            <td>Hasan Karayel</td>
            <td>Başlangıç</td>
            <td>Erkek</td>
            <td>25</td>
            <td>Ataşehir</td>
            <td>4 / 5</td>
            <td>
              <button className={styles["accept-button"]}>Davet et</button>
            </td>
          </tr>
          <tr className={styles["player-row"]}>
            <td>
              <img
                src="/images/players/player1.png"
                className={styles["player-image"]}
              />
            </td>
            <td>Hasan Karayel</td>
            <td>Başlangıç</td>
            <td>Erkek</td>
            <td>25</td>
            <td>Ataşehir</td>
            <td>4 / 5</td>
            <td>
              <button className={styles["accept-button"]}>Davet et</button>
            </td>
          </tr>
          <tr className={styles["player-row"]}>
            <td>
              <img
                src="/images/players/player1.png"
                className={styles["player-image"]}
              />
            </td>
            <td>Hasan Karayel</td>
            <td>Başlangıç</td>
            <td>Erkek</td>
            <td>25</td>
            <td>Ataşehir</td>
            <td>4 / 5</td>
            <td>
              <button className={styles["accept-button"]}>Davet et</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div></div>
    </div>
  );
};

export default MatchResults;
