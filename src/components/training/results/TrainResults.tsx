import React from "react";
import { Link } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import { useGetPlayersQuery } from "../../../api/apiSlice";

const TrainResults = () => {
  const { data: players, isLoading, isError, error } = useGetPlayersQuery({});

  const today = new Date();
  const year = today.getFullYear();

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
          {isLoading ? (
            <tr>
              <td>Yükleniyor...</td>
            </tr>
          ) : isError ? (
            <tr>
              <td>Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</td>
            </tr>
          ) : (
            players &&
            players.map((player) => (
              <tr key={player.player_id} className={styles["player-row"]}>
                <td>
                  <img
                    src={
                      player.image ? player.image : "/images/icons/avatar.png"
                    }
                    alt={player.name}
                    className={styles["player-image"]}
                  />
                </td>
                <td>{`${player.fname} ${player.lname}`}</td>
                <td>{player.level}</td>
                <td>{player.gender}</td>
                <td>{year - Number(player.birth_year)}</td>
                <td>{player.location}</td>
                <td>
                  <Link
                    to={paths.TRAIN_INVITE}
                    state={{
                      fname: player.fname,
                      lname: player.lname,
                      image: player.image,
                      court_price: "100",
                    }}
                    className={styles["accept-button"]}
                  >
                    Davet gönder
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div></div>
    </div>
  );
};

export default TrainResults;
