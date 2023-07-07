import { Link } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

const LessonResults = () => {
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Ders</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Eğitmen</th>
            <th>İsim</th>
            <th>Kulüp</th>
            <th>Tecrübe</th>
            <th>Cinsiyet</th>
            <th>Yaş</th>
            <th>Konum</th>
            <th>Fiyat (saat)</th>
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
            <td>Ferdi / Bağımsız</td>
            <td>11 yıl</td>
            <td>Erkek</td>
            <td>41</td>
            <td>Ataşehir</td>
            <td>150 TL</td>
            <td>4/5</td>
            <td>
              <Link
                to={paths.LESSON_INVITE}
                state={{
                  fname: "Hasan",
                  lname: "Karayel",
                  image: "/images/players/player1.png",
                  lesson_price: "150",
                  court_price: "100",
                }}
                className={styles["accept-button"]}
              >
                Davet gönder
              </Link>
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
            <td>Ferdi / Bağımsız</td>
            <td>11 yıl</td>
            <td>Erkek</td>
            <td>41</td>
            <td>Ataşehir</td>
            <td>150 TL</td>
            <td>4/5</td>
            <td>
              <Link
                to={paths.LESSON_INVITE}
                state={{
                  fname: "Hasan",
                  lname: "Karayel",
                  image: "/images/players/player1.png",
                  lesson_price: "150",
                  court_price: "100",
                }}
                className={styles["accept-button"]}
              >
                Davet gönder
              </Link>
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
            <td>Ferdi / Bağımsız</td>
            <td>11 yıl</td>
            <td>Erkek</td>
            <td>41</td>
            <td>Ataşehir</td>
            <td>150 TL</td>
            <td>4/5</td>
            <td>
              <Link
                to={paths.LESSON_INVITE}
                state={{
                  fname: "Hasan",
                  lname: "Karayel",
                  image: "/images/players/player1.png",
                  lesson_price: "150",
                  court_price: "100",
                }}
                className={styles["accept-button"]}
              >
                Davet gönder
              </Link>
            </td>
          </tr>
        </tbody>
      </table>

      <div></div>
    </div>
  );
};

export default LessonResults;
