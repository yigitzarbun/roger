import React, { useEffect, useState } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../routing/Paths";

import { useAppSelector } from "../../../store/hooks";

import { useGetPlayerByUserIdQuery } from "../../../api/endpoints/PlayersApi";

import { useGetPlayersLeaderboardQuery } from "../../../api/endpoints/BookingsApi";
import PageLoading from "../../../components/loading/PageLoading";
import { getAge } from "../../../common/util/TimeFunctions";

interface PlayerLeaderBoardResultsProps {
  playerLevelId: number;
  textSearch: string;
  locationId: number;
  favourite: boolean | null;
}
const PlayersLeaderboardResults = (props: PlayerLeaderBoardResultsProps) => {
  const { playerLevelId, textSearch, locationId, favourite } = props;

  const user = useAppSelector((store) => store.user?.user?.user);

  const { data: playerDetails, isLoading: isPlayerDetailsLoading } =
    useGetPlayerByUserIdQuery(user?.user_id);

  const [currentPage, setCurrentPage] = useState(1);
  const levelId = Number(playerLevelId) ?? null;
  const locationIdValue = Number(locationId) ?? null;

  const {
    data: leaderboard,
    isLoading: isLeaderboardLoading,
    refetch: refetchLeaderBoard,
  } = useGetPlayersLeaderboardQuery({
    perPage: 5,
    currentPageNumber: currentPage,
    gender: playerDetails?.[0]?.gender,
    playerLevelId: playerLevelId,
    textSearch: textSearch,
    locationId: locationId,
  });

  const pageNumbers = [];
  for (let i = 1; i <= leaderboard?.totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePlayerPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % leaderboard?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + leaderboard?.totalPages) % leaderboard?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };

  useEffect(() => {
    if (playerDetails) {
      refetchLeaderBoard();
    }
  }, [playerDetails, levelId, locationIdValue, textSearch]);

  if (isLeaderboardLoading || isPlayerDetailsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <h2 className={styles.title}>Liderlik Tablosu</h2>
        {leaderboard.totalPages > 1 && (
          <div className={styles["nav-container"]}>
            <FaAngleLeft
              onClick={handlePrevPage}
              className={styles["nav-arrow"]}
            />

            <FaAngleRight
              onClick={handleNextPage}
              className={styles["nav-arrow"]}
            />
          </div>
        )}
      </div>
      {leaderboard?.leaderboard?.length > 0 ? (
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
          {leaderboard?.leaderboard?.length > 0 && (
            <tbody>
              {leaderboard?.leaderboard?.map((player, index) => (
                <tr key={player.user_id} className={styles["player-row"]}>
                  <td>
                    <Link to={`${paths.EXPLORE_PROFILE}1/${player.user_id}`}>
                      <img
                        src={
                          player.image
                            ? player.image
                            : "/images/icons/avatar.jpg"
                        }
                        alt={player.fname}
                        className={styles["player-image"]}
                      />
                    </Link>
                  </td>
                  <td>{index + 1}</td>
                  <td className={styles["draw-count"]}>
                    {player.playerpoints}
                  </td>
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
      ) : (
        <p>Liderlik tablosunda puanı bulunan oyuncu henüz bulunmamaktadır</p>
      )}

      <div className={styles["pages-container"]}>
        {pageNumbers?.map((pageNumber) => (
          <button
            key={pageNumber}
            value={pageNumber}
            onClick={handlePlayerPage}
            className={
              pageNumber === Number(currentPage)
                ? styles["active-page"]
                : styles["passive-page"]
            }
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayersLeaderboardResults;
