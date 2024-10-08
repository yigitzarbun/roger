import React, { useEffect, useState, ChangeEvent } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { BsSortDown } from "react-icons/bs";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaFilter } from "react-icons/fa6";
import { ImBlocked } from "react-icons/im";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import paths from "../../../../routing/Paths";
import { User } from "../../../../store/slices/authSlice";
import PageLoading from "../../../../components/loading/PageLoading";
import { getAge } from "../../../../common/util/TimeFunctions";
import { Location } from "../../../../../api/endpoints/LocationsApi";
import { PlayerLevel } from "../../../../../api/endpoints/PlayerLevelsApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useUpdateFavouriteMutation,
} from "../../../../../api/endpoints/FavouritesApi";
import {
  useGetPaginatedPlayersQuery,
  useGetPlayerByUserIdQuery,
} from "../../../../../api/endpoints/PlayersApi";
import { handleToggleFavourite } from "../../../../common/util/UserDataFunctions";
import TrainingInviteFormModal from "../../../../components/invite/training/form/TrainingInviteFormModal";
import MatchInviteFormModal from "../../../../components/invite/match/form/MatchInviteFormModal";
import ExplorePlayersFilterModal from "./explore-players-filter/ExplorePlayersFilterModal";
import LessonInviteFormModal from "../../../../components/invite/lesson/form/LessonInviteFormModal";
import ExplorePlayersSortModal from "./explore-players-sort/ExplorePlayersSortModal";
import { useTranslation } from "react-i18next";
import { imageUrl } from "../../../../common/constants/apiConstants";

interface ExplorePlayersProps {
  user: User;
  locations: Location[];
  playerLevels: PlayerLevel[];
  isLocationsLoading: boolean;
  isPlayerLevelsLoading: boolean;
  handleLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleGender: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
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
    handleClear,
    playerLevelId,
    textSearch,
    gender,
    locationId,
  } = props;

  const { t } = useTranslation();

  let isUserPlayer = false;

  let isUserTrainer = false;

  let isUserClub = false;

  if (user) {
    isUserPlayer = user?.user?.user_type_id === 1;
    isUserTrainer = user?.user?.user_type_id === 2;
    isUserClub = user?.user?.user_type_id === 3;
  }

  const [isPlayerFilterModalOpen, setIsPlayerFilterModalOpen] = useState(false);

  const handleOpenPlayerFilterModal = () => {
    setIsPlayerFilterModalOpen(true);
  };
  const handleClosePlayerFilterModal = () => {
    setIsPlayerFilterModalOpen(false);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const playerAge = user?.playerDetails?.birth_year;

  const playerLocationId = isUserPlayer
    ? user?.playerDetails?.location_id
    : isUserTrainer
    ? user?.trainerDetails?.location_id
    : isUserClub
    ? user?.clubDetails?.location_id
    : null;

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

  const [sortModalOpen, setSortModalOpen] = useState(false);

  const handleOpenSortModal = () => {
    setSortModalOpen(true);
  };

  const handleCloseSortModal = () => {
    setSortModalOpen(false);
  };

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
    minAgeYear: isUserPlayer ? Number(playerAge) - 5 : null,
    maxAgeYear: isUserPlayer ? Number(playerAge) + 5 : null,
    proximityLocationId: playerLocationId,
    logicLevelId: isUserPlayer ? logicLevelId : null,
    column: orderByColumn,
    direction: orderByDirection,
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

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const handleOpenLessonModal = (userId: number) => {
    setOpponentUserId(userId);
    setIsLessonModalOpen(true);
  };

  const handleCloseLessonModal = () => {
    setIsLessonModalOpen(false);
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
  }, [
    currentPage,
    textSearch,
    playerLevelId,
    gender,
    locationId,
    orderByDirection,
    orderByColumn,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [textSearch, playerLevelId, gender, locationId]);

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
          <h2 className={styles["result-title"]}>{t("explorePlayersTitle")}</h2>
          <div className={styles.icons}>
            <FaFilter
              onClick={handleOpenPlayerFilterModal}
              className={
                playerLevelId > 0 ||
                gender !== "" ||
                locationId > 0 ||
                textSearch !== ""
                  ? styles["active-filter"]
                  : styles.filter
              }
            />
            <BsSortDown
              className={
                orderByColumn === ""
                  ? styles["passive-sort"]
                  : styles["active-sort"]
              }
              onClick={handleOpenSortModal}
            />
          </div>
        </div>
        {paginatedPlayers?.totalPages > 1 && (
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
        )}
      </div>
      {paginatedPlayers?.players?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{t("tableFavouriteHeader")}</th>
              <th>{t("tablePlayerHeader")}</th>
              <th>{t("tableNameHeader")}</th>
              <th>{t("tableLevelHeader")}</th>
              <th>{t("tableGenderHeader")}</th>
              <th>{t("tableAgeHeader")}</th>
              <th>{t("tableLocationHeader")}</th>
              <th>
                {isUserPlayer
                  ? t("tableTrainHeader")
                  : isUserTrainer
                  ? t("tableLessonHeader")
                  : ""}
              </th>
              <th>{isUserPlayer && t("tableMatchHeader")}</th>
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
                        player.image
                          ? `${imageUrl}/${player.image}`
                          : "/images/icons/avatar.jpg"
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
                  {player.player_level_id === 1
                    ? t("playerLevelBeginner")
                    : player?.player_level_id === 2
                    ? t("playerLevelIntermediate")
                    : player?.player_level_id === 3
                    ? t("playerLevelAdvanced")
                    : t("playerLevelProfessinal")}
                </td>
                <td>{player.gender === "male" ? t("male") : t("female")}</td>
                <td>{getAge(player.birth_year)}</td>
                <td>{player?.location_name}</td>
                <td>
                  {isUserPlayer ? (
                    <button
                      onClick={() => handleOpenTrainingModal(player?.user_id)}
                      className={styles["training-button"]}
                    >
                      {t("tableTrainButtonText")}
                    </button>
                  ) : isUserTrainer ? (
                    <button
                      onClick={() => handleOpenLessonModal(player.user_id)}
                      className={styles["match-button"]}
                    >
                      {t("tableLessonButtonText")}
                    </button>
                  ) : (
                    ""
                  )}
                </td>
                <td>
                  {isUserPlayer && player.gender === userGender ? (
                    <button
                      onClick={() => handleOpenMatchModal(player?.user_id)}
                      className={styles["match-button"]}
                    >
                      {t("tableMatchButtonText")}
                    </button>
                  ) : (
                    isUserPlayer &&
                    player.gender !== userGender && (
                      <ImBlocked className={styles.blocked} />
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{t("playersEmptyText")}</p>
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
      {isTrainingModalOpen && (
        <TrainingInviteFormModal
          opponentUserId={opponentUserId}
          isInviteModalOpen={isTrainingModalOpen}
          handleCloseInviteModal={handleCloseTrainingModal}
        />
      )}
      {isMatchModalOpen && (
        <MatchInviteFormModal
          opponentUserId={opponentUserId}
          isInviteModalOpen={isMatchModalOpen}
          handleCloseInviteModal={handleCloseMatchModal}
        />
      )}
      {isLessonModalOpen && (
        <LessonInviteFormModal
          opponentUserId={opponentUserId}
          isInviteModalOpen={isLessonModalOpen}
          handleCloseInviteModal={handleCloseLessonModal}
          isUserPlayer={isUserPlayer}
          isUserTrainer={isUserTrainer}
        />
      )}
      {isPlayerFilterModalOpen && (
        <ExplorePlayersFilterModal
          isPlayerFilterModalOpen={isPlayerFilterModalOpen}
          handleClosePlayerFilterModal={handleClosePlayerFilterModal}
          locations={locations}
          handleLocation={handleLocation}
          handleClear={handleClear}
          locationId={locationId}
          handleTextSearch={handleTextSearch}
          textSearch={textSearch}
          handleLevel={handleLevel}
          playerLevelId={playerLevelId}
          playerLevels={playerLevels}
          handleGender={handleGender}
          gender={gender}
        />
      )}

      {sortModalOpen && (
        <ExplorePlayersSortModal
          sortModalOpen={sortModalOpen}
          handleCloseSortModal={handleCloseSortModal}
          handleOrderBy={handleOrderBy}
          handleClearOrderBy={handleClearOrderBy}
          orderByDirection={orderByDirection}
          orderByColumn={orderByColumn}
        />
      )}
    </div>
  );
};
export default ExplorePlayers;
