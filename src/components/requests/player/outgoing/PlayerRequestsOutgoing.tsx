import styles from "./styles.module.scss";

const PlayerRequestsOutgoing = () => {
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Gönderilen Davetler</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Oyuncu</th>
            <th>İsim</th>
            <th>Seviye</th>
            <th>Cinsiyet</th>
            <th>Yaş</th>
            <th>Tür </th>
            <th>Tarih</th>
            <th>Saat </th>
            <th>Kort</th>
            <th>Konum</th>
            <th>Değerlendirme</th>
            <th>
              Ücret<span className={styles["fee"]}>*</span>
            </th>
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
            <td>Antreman</td>
            <td>21.05.2023</td>
            <td>21:00</td>
            <td>Kort 1</td>
            <td>Enka Spor ..</td>
            <td>4 / 5</td>
            <td>75 TL</td>
            <td>
              <button className={styles["cancel-button"]}>İptal et</button>
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
            <td>Ders</td>
            <td>21.05.2023</td>
            <td>21:00</td>
            <td>Kort 1</td>
            <td>Enka Spor ..</td>
            <td>4 / 5</td>
            <td>150 TL</td>
            <td>
              <button className={styles["cancel-button"]}>İptal et</button>
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
            <td>Maç</td>
            <td>21.05.2023</td>
            <td>21:00</td>
            <td>Kort 1</td>
            <td>Enka Spor ..</td>
            <td>4 / 5</td>
            <td>75 TL</td>
            <td>
              <button className={styles["cancel-button"]}>İptal et</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p className={styles["fee-text"]}>
        (*) Kort ücreti ve diğer tüm masraflar dahil ödeyeceğin tutar.
      </p>
    </div>
  );
};

export default PlayerRequestsOutgoing;
