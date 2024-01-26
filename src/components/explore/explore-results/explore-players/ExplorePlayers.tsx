import React, { useEffect, useState, ChangeEvent } from "react";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaFilter } from "react-icons/fa6";
import { ImBlocked } from "react-icons/im";
import { SlOptions } from "react-icons/sl";

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
import TrainingInviteFormModal from "../../../../components/invite/training/form/TrainingInviteFormModal";
import MatchInviteFormModal from "../../../../components/invite/match/form/MatchInviteFormModal";

interface ExplorePlayersProps {
  user: User;
  players: Player[];
  locations: Location[];
  playerLevels: PlayerLevel[];
  isLocationsLoading: boolean;
  isPlayersLoading: boolean;
  isPlayerLevelsLoading: boolean;
  handleLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleGender: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  playerLevelId: number;
  textSearch: string;
  gender: string;
  locationId: number;
}
const ExplorePlayers = (props: ExplorePlayersProps) => {
  const {
    user,
    locations,
    playerLevels,
    isLocationsLoading,
    isPlayerLevelsLoading,
    handleLevel,
    handleTextSearch,
    handleGender,
    handleLocation,
    playerLevelId,
    textSearch,
    gender,
    locationId,
  } = props;

  let isUserPlayer = false;
  let isUserTrainer = false;

  if (user) {
    isUserPlayer = user?.user?.user_type_id === 1;
    isUserTrainer = user?.user?.user_type_id === 2;
  }

  const [filter, setFilter] = useState(false);
  const toggleFilter = () => {
    setFilter((curr) => !curr);
  };
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: paginatedPlayers,
    isLoading: isPaginatedPlayersLoading,
    refetch: refetchPaginatedPlayers,
  } = useGetPaginatedPlayersQuery({
    currentPage: currentPage,
    playerLevelId: playerLevelId,
    selectedGender: gender,
    locationId: locationId,
    currentUserId: user?.user?.user_id,
    textSearch: textSearch,
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
  const [opponentUserId, setOpponentUserId] = useState(null);

  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const handleOpenTrainingModal = (userId: number) => {
    setOpponentUserId(userId);
    setIsTrainingModalOpen(true);
  };
  const handleCloseTrainingModal = () => {
    setIsTrainingModalOpen(false);
  };
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  const handleOpenMatchModal = (userId: number) => {
    setOpponentUserId(userId);
    setIsMatchModalOpen(true);
  };
  const handleCloseMatchModal = () => {
    setIsMatchModalOpen(false);
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
  }, [currentPage, textSearch, playerLevelId, gender, locationId]);

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
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>Oyuncuları Keşfet</h2>
          <FaFilter onClick={toggleFilter} className={styles.filter} />
        </div>
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

      {filter && (
        <div className={styles["nav-filter-container"]}>
          <div className={styles["search-container"]}>
            <input
              type="text"
              onChange={handleTextSearch}
              value={textSearch}
              placeholder="Oyuncu adı"
            />
          </div>
          <div className={styles["input-container"]}>
            <select
              onChange={handleLevel}
              value={playerLevelId ?? ""}
              className="input-element"
            >
              <option value="">-- Seviye --</option>
              {playerLevels?.map((player_level) => (
                <option
                  key={player_level.player_level_id}
                  value={player_level.player_level_id}
                >
                  {player_level.player_level_name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles["input-container"]}>
            <select
              onChange={handleGender}
              value={gender}
              className="input-element"
            >
              <option value="">-- Cinsiyet --</option>
              <option value="female">Kadın</option>
              <option value="male">Erkek</option>
            </select>
          </div>
          <div className={styles["input-container"]}>
            <select
              onChange={handleLocation}
              value={locationId ?? ""}
              className="input-element"
            >
              <option value="">-- Tüm Konumlar --</option>
              {locations?.map((location) => (
                <option key={location.location_id} value={location.location_id}>
                  {location.location_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

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
                <td>
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
                <td>{player?.player_level_name}</td>
                <td>{player.gender}</td>
                <td>{getAge(player.birth_year)}</td>
                <td>{player?.location_name}</td>
                <td>
                  <div className={styles["action-buttons-container"]}>
                    <button
                      onClick={() => handleOpenTrainingModal(player?.user_id)}
                      className={styles["training-button"]}
                    >
                      Anterman yap
                    </button>

                    {isUserPlayer && player.gender === userGender ? (
                      <button
                        onClick={() => handleOpenMatchModal(player?.user_id)}
                        className={styles["match-button"]}
                      >
                        Maç yap
                      </button>
                    ) : (
                      <ImBlocked />
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
                <td>
                  <SlOptions className={styles.icon} />
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
      <TrainingInviteFormModal
        opponentUserId={opponentUserId}
        isInviteModalOpen={isTrainingModalOpen}
        handleCloseInviteModal={handleCloseTrainingModal}
      />
      <MatchInviteFormModal
        opponentUserId={opponentUserId}
        isInviteModalOpen={isMatchModalOpen}
        handleCloseInviteModal={handleCloseMatchModal}
      />
    </div>
  );
};
export default ExplorePlayers;
