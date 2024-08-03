import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsSortDown } from "react-icons/bs";
import paths from "../../../routing/Paths";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../store/hooks";
import {
  useGetPaginatedPlayersQuery,
  useGetPlayerByUserIdQuery,
} from "../../../api/endpoints/PlayersApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useUpdateFavouriteMutation,
} from "../../../api/endpoints/FavouritesApi";
import { getAge } from "../../../common/util/TimeFunctions";
import MatchInviteFormModal from "../../../components/invite/match/form/MatchInviteFormModal";
import MatchSort from "../sort/MatchSortModal";
import { FaFilter } from "react-icons/fa6";

interface MatchResultsProps {
  playerLevelId: number;
  locationId: number;
  favourite: boolean | null;
  textSearch: string;
  handleOpenFilter: () => void;
}
const MatchResults = (props: MatchResultsProps) => {
  const { playerLevelId, locationId, favourite, textSearch, handleOpenFilter } =
    props;

  const { user } = useAppSelector((store) => store.user);
  const [opponentUserId, setOpponentUserId] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const handleOpenInviteModal = (userId: number) => {
    setOpponentUserId(userId);
    setIsInviteModalOpen(true);
  };
  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  const {
    data: myFavourites,
    isLoading: isMyFavouritesLoading,
    refetch: refetchMyFavourites,
  } = useGetFavouritesByFilterQuery({
    favouriter_id: user?.user?.user_id,
  });

  const [addFavourite, { isSuccess: isAddFavouriteSuccess }] =
    useAddFavouriteMutation();

  const handleAddFavourite = (favouritee_id: number) => {
    const favouriteData = {
      is_active: true,
      favouriter_id: user?.user?.user_id,
      favouritee_id: favouritee_id,
    };
    addFavourite(favouriteData);
  };

  const [updateFavourite, { isSuccess: isUpdateFavouriteSuccess }] =
    useUpdateFavouriteMutation();

  const handleUpdateFavourite = (userId: number) => {
    const selectedFavourite = myFavourites?.find(
      (favourite) => favourite.favouritee_id === userId
    );
    const favouriteData = {
      favourite_id: selectedFavourite.favourite_id,
      registered_at: selectedFavourite.registered_at,
      is_active: selectedFavourite.is_active === true ? false : true,
      favouriter_id: selectedFavourite.favouriter_id,
      favouritee_id: selectedFavourite.favouritee_id,
    };
    updateFavourite(favouriteData);
  };

  const handleToggleFavourite = (userId: number) => {
    if (myFavourites?.find((favourite) => favourite.favouritee_id === userId)) {
      handleUpdateFavourite(userId);
    } else {
      handleAddFavourite(userId);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const levelId = Number(playerLevelId) ?? null;
  const locationIdValue = Number(locationId) ?? null;

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { data: currentPlayer, isLoading: isCurrentPlayerLoading } =
    useGetPlayerByUserIdQuery(user?.user?.user_id);

  const playerAge = user?.playerDetails?.birth_year;
  const playerLocationId = user?.playerDetails?.location_id;
  const logicLevelId = user?.playerDetails?.player_level_id;

  const [orderByDirection, setOrderByDirection] = useState("desc");
  const [orderByColumn, setOrderByColumn] = useState("");

  const handleOrderBy = (orderByColumn: string, orderByDirection: string) => {
    setOrderByColumn(orderByColumn);
    setOrderByDirection(orderByDirection);
  };

  const handleClearOrderBy = () => {
    setOrderByColumn("");
  };

  const [matchSortModalOpen, setMatchSortModalOpen] = useState(false);

  const handleOpenMatchSortModal = () => {
    setMatchSortModalOpen(true);
  };

  const handleCloseMatchSortModal = () => {
    setMatchSortModalOpen(false);
  };

  const {
    data: players,
    isLoading: isPlayersLoading,
    refetch: refetchPaginatedPlayers,
  } = useGetPaginatedPlayersQuery({
    currentPage: currentPage,
    playerLevelId: levelId,
    selectedGender: currentPlayer?.[0].gender,
    locationId: locationIdValue,
    currentUserId: user?.user?.user_id,
    textSearch: textSearch,
    minAgeYear: Number(playerAge) - 5,
    maxAgeYear: Number(playerAge) + 5,
    proximityLocationId: playerLocationId,
    logicLevelId: logicLevelId,
    column: orderByColumn,
    direction: orderByDirection,
  });

  const pageNumbers = [];
  for (let i = 1; i <= players?.totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePlayerPage = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleNextPage = () => {
    const nextPage = (currentPage % players?.totalPages) + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage =
      ((currentPage - 2 + players?.totalPages) % players?.totalPages) + 1;
    setCurrentPage(prevPage);
  };

  const filteredPlayers = players?.players.filter((player) => {
    if (favourite !== true) {
      return player;
    } else if (
      (favourite === true &&
        myFavourites.find(
          (favourite) =>
            favourite.favouritee_id === player.user_id &&
            favourite.is_active === true
        )) ||
      favourite !== true
    ) {
      return player;
    }
  });

  useEffect(() => {
    refetchPaginatedPlayers();
  }, [
    levelId,
    locationIdValue,
    currentPage,
    textSearch,
    orderByDirection,
    orderByColumn,
  ]);

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetchMyFavourites();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  if (
    isPlayersLoading ||
    isLocationsLoading ||
    isPlayerLevelsLoading ||
    isMyFavouritesLoading ||
    isCurrentPlayerLoading
  ) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <div className={styles["title-left"]}>
          <h2 className={styles.title}>Maç</h2>
          <BsSortDown
            className={
              orderByColumn === ""
                ? styles["passive-sort"]
                : styles["active-sort"]
            }
            onClick={handleOpenMatchSortModal}
          />
          <FaFilter
            onClick={handleOpenFilter}
            className={
              locationId > 0 || levelId > 0 || textSearch !== ""
                ? styles["active-filter"]
                : styles.filter
            }
          />
        </div>
        {players?.totalPages > 1 && (
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
      {isPlayersLoading && <p>Yükleniyor...</p>}
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
              <th>Favori</th>
              <th>Oyuncu</th>
              <th>İsim</th>
              <th>Seviye</th>
              <th>Cinsiyet</th>
              <th>Yaş</th>
              <th>Konum</th>
              <th>Maç</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr key={player.player_id} className={styles["player-row"]}>
                <td>
                  {myFavourites?.find(
                    (favourite) =>
                      favourite.favouritee_id === player.user_id &&
                      favourite.is_active === true
                  ) && player.user_id !== user?.user?.user_id ? (
                    <AiFillStar
                      onClick={() => handleToggleFavourite(player.user_id)}
                      className={styles["remove-fav-icon"]}
                    />
                  ) : (
                    player.user_id !== user?.user?.user_id &&
                    !myFavourites?.find(
                      (favourite) =>
                        favourite.favouritee_id === player.user_id &&
                        favourite.is_active === true
                    ) && (
                      <AiOutlineStar
                        onClick={() => handleToggleFavourite(player.user_id)}
                        className={styles["add-fav-icon"]}
                      />
                    )
                  )}
                </td>
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}1/${player.user_id}`}>
                    <img
                      src={
                        player.image ? player.image : "/images/icons/avatar.jpg"
                      }
                      alt={player.name}
                      className={styles["player-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}1/${player.user_id}`}
                    className={styles["player-name"]}
                  >
                    {`${player.fname} ${player.lname}`}{" "}
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
                <td>{getAge(Number(player.birth_year))}</td>
                <td>
                  {
                    locations?.find(
                      (location) => location.location_id === player.location_id
                    ).location_name
                  }
                </td>
                <td>
                  <button
                    onClick={() => handleOpenInviteModal(player?.user_id)}
                    className={styles["match-button"]}
                  >
                    Maç yap
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      {isInviteModalOpen && (
        <MatchInviteFormModal
          opponentUserId={opponentUserId}
          isInviteModalOpen={isInviteModalOpen}
          handleCloseInviteModal={handleCloseInviteModal}
        />
      )}
      {matchSortModalOpen && (
        <MatchSort
          matchSortModalOpen={matchSortModalOpen}
          handleCloseMatchSortModal={handleCloseMatchSortModal}
          handleOrderBy={handleOrderBy}
          handleClearOrderBy={handleClearOrderBy}
          orderByDirection={orderByDirection}
          orderByColumn={orderByColumn}
        />
      )}
    </div>
  );
};

export default MatchResults;
