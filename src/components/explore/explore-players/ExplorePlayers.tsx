import React from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../routing/Paths";

import { User } from "../../../store/slices/authSlice";

import { Player } from "../../../api/endpoints/PlayersApi";
import { Location } from "../../../api/endpoints/LocationsApi";
import { PlayerLevel } from "../../../api/endpoints/PlayerLevelsApi";

interface ExplorePlayersProps {
  user: User;
  players: Player[];
  locations: Location[];
  playerLevels: PlayerLevel[];
  isPlayersLoading: boolean;
  isLocationsLoading: boolean;
  isPlayerLevelsLoading: boolean;
}
const ExplorePlayers = (props: ExplorePlayersProps) => {
  const {
    user,
    players,
    locations,
    playerLevels,
    isPlayersLoading,
    isLocationsLoading,
    isPlayerLevelsLoading,
  } = props;

  let isUserPlayer = false;
  let isUserTrainer = false;
  let isUserClub = false;

  if (user) {
    isUserPlayer = user.user.user_type_id === 1;
    isUserTrainer = user.user.user_type_id === 2;
    isUserClub = user.user.user_type_id === 3;
  }

  const currentDate = new Date();
  const year = currentDate.getFullYear();

  if (
    !user ||
    isPlayersLoading ||
    isLocationsLoading ||
    isPlayerLevelsLoading
  ) {
    return <div>Yükleniyor ..</div>;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Oyuncuları Keşfet</h2>
      </div>
      {players && players.length === 0 && (
        <p>
          Aradığınız kritere göre oyuncu bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
      )}
      {players && players.length > 0 && (
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
            {players.map((player) => (
              <tr key={player.player_id} className={styles["player-row"]}>
                <td>
                  <img
                    src={
                      player.image ? player.image : "/images/icons/avatar.png"
                    }
                    alt={player.fname}
                    className={styles["player-image"]}
                  />
                </td>
                <td>{`${player.fname} ${player.lname}`}</td>
                <td>
                  {
                    playerLevels?.find(
                      (player_level) =>
                        player_level.player_level_id === player.player_level_id
                    ).player_level_name
                  }
                </td>
                <td>{player.gender}</td>
                <td>{year - Number(player.birth_year)}</td>
                <td>
                  {
                    locations?.find(
                      (location) => location.location_id === player.location_id
                    ).location_name
                  }
                </td>
                {isUserPlayer && (
                  <td>
                    <Link
                      to={paths.TRAIN_INVITE}
                      state={{
                        fname: player.fname,
                        lname: player.lname,
                        image: player.image,
                        court_price: "",
                        user_id: player.user_id,
                      }}
                    >
                      Antreman yap
                    </Link>
                  </td>
                )}
                {isUserPlayer && (
                  <td>
                    <Link
                      to={paths.MATCH_INVITE}
                      state={{
                        fname: player.fname,
                        lname: player.lname,
                        image: player.image,
                        court_price: "",
                        user_id: player.user_id,
                      }}
                    >
                      Maç yap
                    </Link>
                  </td>
                )}
                {isUserTrainer && (
                  <td>
                    <Link
                      to={paths.LESSON_INVITE}
                      state={{
                        fname: player.fname,
                        lname: player.lname,
                        image: player.image,
                        court_price: "",
                        user_id: player.user_id,
                      }}
                    >
                      Derse davet et
                    </Link>
                  </td>
                )}
                <td>Takip et</td>
                <td>Görüntüle</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default ExplorePlayers;
