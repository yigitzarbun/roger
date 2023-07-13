import React from "react";
import { Link } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import { useGetPlayersQuery } from "../../../store/auth/apiSlice";

import { useAppSelector } from "../../../store/hooks";

interface TrainResultsProps {
  level: string;
  gender: string;
  location: string;
}

const TrainResults = (props: TrainResultsProps) => {
  const { level, gender, location } = props;

  const { user } = useAppSelector((store) => store.user);

  const { data: players, isLoading, isError } = useGetPlayersQuery({});

  const today = new Date();
  const year = today.getFullYear();

  const filteredPlayers =
    players &&
    players
      .filter((player) => player.player_id !== user.player_id)
      .filter((player) => {
        if (level === "" && gender === "" && location === "") {
          return player;
        } else if (
          (level === player.level || level === "") &&
          (gender === player.gender || gender === "") &&
          (location === player.location || location === "")
        ) {
          return player;
        }
      });

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Antreman</h2>
      </div>
      {isLoading ? (
        <p>Yükleniyor...</p>
      ) : (
        isError && <p>Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
      )}
      {players && filteredPlayers.length === 0 && (
        <p>
          Aradığınız kritere göre oyuncu bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
      )}
      {players && filteredPlayers.length > 0 && (
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
            {filteredPlayers.map((player) => (
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrainResults;
