import { Link } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

const TrainResults = () => {
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Antreman</h2>
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
            <td>
              <Link
                to={paths.TRAIN_INVITE}
                state={{
                  fname: "Hasan",
                  lname: "Karayel",
                  image: "/images/players/player1.png",
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
            <td>Başlangıç</td>
            <td>Erkek</td>
            <td>25</td>
            <td>Ataşehir</td>
            <td>
              <Link
                to={paths.TRAIN_INVITE}
                state={{
                  fname: "Hasan",
                  lname: "Karayel",
                  image: "/images/players/player1.png",
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
            <td>Başlangıç</td>
            <td>Erkek</td>
            <td>25</td>
            <td>Ataşehir</td>
            <td>
              <Link
                to={paths.TRAIN_INVITE}
                state={{
                  fname: "Hasan",
                  lname: "Karayel",
                  image: "/images/players/player1.png",
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

export default TrainResults;
