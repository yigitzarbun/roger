import React, { useEffect, useState } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import paths from "../../../../routing/Paths";
import { useAppSelector } from "../../../../store/hooks";
import { useGetPlayerByUserIdQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetPlayersLeaderboardQuery } from "../../../../api/endpoints/BookingsApi";
import PageLoading from "../../../../components/loading/PageLoading";
import { getAge } from "../../../../common/util/TimeFunctions";

const PlayerHomeLeaderboard = () => {
  const user = useAppSelector((store) => store.user?.user?.user);

  const [currentPage, setCurrentPage] = useState(1);

  const { t } = useTranslation();

  const { data: playerDetails, isLoading: isPlayerDetailsLoading } =
    useGetPlayerByUserIdQuery(user?.user_id);

  const {
    data: leaderboard,
    isLoading: isLeaderboardLoading,
    refetch: refetchLeaderBoard,
  } = useGetPlayersLeaderboardQuery({
    perPage: 5,
    currentPageNumber: currentPage,
    gender: playerDetails?.[0]?.gender,
  });

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
  }, [playerDetails]);

  if (isLeaderboardLoading || isPlayerDetailsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <h2 className={styles.title}>{t("leaderboardTitle")}</h2>
        {leaderboard?.totalPages > 1 && (
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
              <th>{t("leaderboardTablePlayerHeader")}</th>
              <th>{t("leaderboardTableRankingHeader")}</th>
              <th>{t("leaderboardTablePointsHeader")}</th>
              <th>{t("leaderboardTablePlayerNameHeader")}</th>
              <th>{t("leaderboardTableLevelHeader")}</th>
              <th>{t("leaderboardTableLocationHeader")}</th>
              <th>{t("leaderboardTableGenderHeader")}</th>
              <th>{t("leaderboardTableAgeHeader")}</th>
              <th>{t("leaderboardTableMatchesHeader")}</th>
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
                  <td>
                    {player.player_level_id === 1
                      ? t("playerLevelBeginner")
                      : player?.player_level_id === 2
                      ? t("playerLevelIntermediate")
                      : player?.player_level_id === 3
                      ? t("playerLevelAdvanced")
                      : t("playerLevelProfessinal")}
                  </td>
                  <td>{player.location_name}</td>
                  <td>{player.gender === "male" ? t("male") : t("female")}</td>
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
        <p>{t("leaderboardTableEmptyText")}</p>
      )}
      {leaderboard?.leaderboard?.length > 0 && (
        <Link
          to={paths.PLAYERS_LEADERBOARD}
          className={styles["view-all-button"]}
        >
          {t("leaderBoardViewAllButtonText")}{" "}
        </Link>
      )}
    </div>
  );
};

export default PlayerHomeLeaderboard;
