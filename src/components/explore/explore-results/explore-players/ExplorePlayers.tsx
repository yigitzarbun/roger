import React, { useEffect, useState } from "react";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

import { AiFillStar, AiOutlineStar } from "react-icons/ai";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { User } from "../../../../store/slices/authSlice";
import PageLoading from "../../../../components/loading/PageLoading";
import { getAge } from "../../../../common/util/TimeFunctions";

import { Location } from "../../../../api/endpoints/LocationsApi";
import { PlayerLevel } from "../../../../api/endpoints/PlayerLevelsApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useUpdateFavouriteMutation,
} from "../../../../api/endpoints/FavouritesApi";
import {
  Player,
  useGetPaginatedPlayersQuery,
  useGetPlayerByUserIdQuery,
} from "../../../../api/endpoints/PlayersApi";
import { handleToggleFavourite } from "../../../../common/util/UserDataFunctions";

interface ExplorePlayersProps {
  user: User;
  players: Player[];
  locations: Location[];
  playerLevels: PlayerLevel[];
  isLocationsLoading: boolean;
  isPlayersLoading: boolean;
  isPlayerLevelsLoading: boolean;
}
const ExplorePlayers = (props: ExplorePlayersProps) => {
  const {
    user,
    locations,
    playerLevels,
    isLocationsLoading,
    isPlayerLevelsLoading,
  } = props;

  let isUserPlayer = false;
  let isUserTrainer = false;

  if (user) {
    isUserPlayer = user?.user?.user_type_id === 1;
    isUserTrainer = user?.user?.user_type_id === 2;
  }

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: paginatedPlayers,
    isLoading: isPaginatedPlayersLoading,
    refetch: refetchPaginatedPlayers,
  } = useGetPaginatedPlayersQuery({
    currentPage: currentPage,
    playerLevelId: null,
    selectedGender: "",
    locationId: null,
    currentUserId: user?.user?.user_id,
  });

  const pageNumbers = [];
  for (let i = 1; i <= paginatedPlayers?.totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePlayerPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % paginatedPlayers?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + paginatedPlayers?.totalPages) %
        paginatedPlayers?.totalPages) +
      1;
    setCurrentPage(prevPage);
  };

  const {
    data: myFavouritePlayers,
    isLoading: isFavouritesLoading,
    refetch,
  } = useGetFavouritesByFilterQuery({ favouriter_id: user?.user?.user_id });

  const [addFavourite, { isSuccess: isAddFavouriteSuccess }] =
    useAddFavouriteMutation();

  const [updateFavourite, { isSuccess: isUpdateFavouriteSuccess }] =
    useUpdateFavouriteMutation();

  const isPlayerInMyFavourites = (user_id: number) => {
    return myFavouritePlayers?.find(
      (player) => player.favouritee_id === user_id
    );
  };

  const { data: currentPlayer, isLoading: isCurrentPlayerLoading } =
    useGetPlayerByUserIdQuery(user?.user?.user_id);

  const userGender = currentPlayer?.[0]?.gender;

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetch();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  useEffect(() => {
    refetchPaginatedPlayers();
  }, [currentPage]);

  if (
    isPaginatedPlayersLoading ||
    isLocationsLoading ||
    isPlayerLevelsLoading ||
    isFavouritesLoading ||
    isCurrentPlayerLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Oyuncuları Keşfet</h2>
        <div className={styles["navigation-container"]}>
          <FaAngleLeft
            onClick={handlePrevPage}
            className={styles["nav-arrow"]}
          />

          <FaAngleRight
            onClick={handleNextPage}
            className={styles["nav-arrow"]}
          />
        </div>
      </div>
      {paginatedPlayers?.players?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Oyuncu</th>
              <th>İsim</th>
              <th>Seviye</th>
              <th>Cinsiyet</th>
              <th>Yaş</th>
              <th>Konum</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPlayers?.players?.map((player) => (
              <tr key={player.player_id} className={styles["player-row"]}>
                <td>
                  {isPlayerInMyFavourites(player.user_id)?.is_active ===
                  true ? (
                    <AiFillStar
                      className={styles["remove-fav-icon"]}
                      onClick={() =>
                        handleToggleFavourite(
                          player.user_id,
                          isPlayerInMyFavourites,
                          updateFavourite,
                          myFavouritePlayers,
                          user,
                          addFavourite
                        )
                      }
                    />
                  ) : (
                    <AiOutlineStar
                      className={styles["add-fav-icon"]}
                      onClick={() =>
                        handleToggleFavourite(
                          player.user_id,
                          isPlayerInMyFavourites,
                          updateFavourite,
                          myFavouritePlayers,
                          user,
                          addFavourite
                        )
                      }
                    />
                  )}
                </td>
                <td className={styles["vertical-center"]}>
                  <Link to={`${paths.EXPLORE_PROFILE}1/${player.user_id} `}>
                    <img
                      src={
                        player.image ? player.image : "/images/icons/avatar.png"
                      }
                      className={styles["player-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${player.user_id} `}
                    className={styles["player-name"]}
                  >
                    <p>{`${player.fname} ${player.lname}`}</p>
                  </Link>
                </td>
                <td>
                  {
                    playerLevels?.find(
                      (player_level) =>
                        player_level.player_level_id === player.player_level_id
                    ).player_level_name
                  }
                </td>
                <td>{player.gender}</td>
                <td>{getAge(player.birth_year)}</td>
                <td>
                  {
                    locations?.find(
                      (location) => location.location_id === player.location_id
                    ).location_name
                  }
                </td>
                <td className={styles["vertical-center"]}>
                  <div className={styles["action-buttons-container"]}>
                    {isUserPlayer && (
                      <Link
                        to={paths.TRAIN_INVITE}
                        state={{
                          fname: player.fname,
                          lname: player.lname,
                          image: player.image,
                          court_price: "",
                          user_id: player.user_id,
                        }}
                        className={styles["training-button"]}
                      >
                        Antreman yap
                      </Link>
                    )}
                    {isUserPlayer && player.gender === userGender && (
                      <Link
                        to={paths.MATCH_INVITE}
                        state={{
                          fname: player.fname,
                          lname: player.lname,
                          image: player.image,
                          court_price: "",
                          user_id: player.user_id,
                        }}
                        className={styles["match-button"]}
                      >
                        Maç yap
                      </Link>
                    )}
                    {isUserTrainer && (
                      <Link
                        to={paths.LESSON_INVITE}
                        state={{
                          fname: player.fname,
                          lname: player.lname,
                          image: player.image,
                          court_price: "",
                          user_id: player.user_id,
                        }}
                        className={styles["match-button"]}
                      >
                        Derse davet et
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>
          Aradığınız kritere göre oyuncu bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
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
export default ExplorePlayers;
