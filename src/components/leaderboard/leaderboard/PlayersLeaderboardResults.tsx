import React, { useEffect } from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../routing/Paths";

import { useAppSelector } from "../../../store/hooks";

import { useGetPlayerByUserIdQuery } from "../../../api/endpoints/PlayersApi";

import { useGetMensLeaderboardQuery } from "../../../api/endpoints/BookingsApi";
import PageLoading from "../../../components/loading/PageLoading";
import { getAge } from "../../../common/util/TimeFunctions";

const PlayersLeaderboardResults = () => {
  const user = useAppSelector((store) => store.user?.user?.user);

  const { data: playerDetails, isLoading: isPlayerDetailsLoading } =
    useGetPlayerByUserIdQuery(user?.user_id);

  const {
    data: leaderboard,
    isLoading: isLeaderboardLoading,
    refetch: refetchLeaderBoard,
  } = useGetMensLeaderboardQuery(playerDetails?.[0]?.gender);

  useEffect(() => {
    if (playerDetails) {
      refetchLeaderBoard();
    }
  }, [playerDetails]);

  if (isLeaderboardLoading || isPlayerDetailsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <h2 className={styles["result-title"]}>Lidrelik Tablosu</h2>
      <table>
        <thead>
          <tr>
            <th>Oyuncu</th>
            <th>Sıralama</th>
            <th>Puan</th>
            <th>İsim</th>
            <th>Seviye</th>
            <th>Konum</th>
            <th>Cinsiyet</th>
            <th>Yaş</th>
            <th>Toplam Maç</th>
            <th>W</th>
            <th>L</th>
          </tr>
        </thead>
        {leaderboard?.length > 0 && (
          <tbody>
            {leaderboard.map((player, index) => (
              <tr key={player.user_id} className={styles["player-row"]}>
                <td className={styles["vertical-center"]}>
                  <Link to={`${paths.EXPLORE_PROFILE}1/${player.user_id}`}>
                    <img
                      src={
                        player.image ? player.image : "/images/icons/avatar.png"
                      }
                      alt={player.fname}
                      className={styles["player-image"]}
                    />
                  </Link>
                </td>
                <td>{index + 1}</td>
                <td className={styles["draw-count"]}>{player.playerpoints}</td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${player.user_id}`}
                    className={styles["player-name"]}
                  >
                    {`${player.fname} ${player.lname}`}
                  </Link>
                </td>
                <td>{player.player_level_name}</td>
                <td>{player.location_name}</td>
                <td>{player.gender}</td>
                <td>{getAge(player.birth_year)}</td>
                <td>{player.totalmatches}</td>
                <td className={styles["win-count"]}>{player.wonmatches}</td>
                <td className={styles["lost-count"]}>{player.lostmatches}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default PlayersLeaderboardResults;
