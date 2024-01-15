import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

import { useGetPaginatedPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useGetFavouritesByFilterQuery } from "../../../api/endpoints/FavouritesApi";
import { getAge } from "../../../common/util/TimeFunctions";
import TrainingInviteFormModal from "../../../components/invite/training/form/TrainingInviteFormModal";

interface TrainResultsProps {
  playerLevelId: number;
  textSearch: string;
  gender: string;
  locationId: number;
  favourite: boolean | null;
}

const TrainResults = (props: TrainResultsProps) => {
  const { playerLevelId, textSearch, gender, locationId, favourite } = props;

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
    isLoading: isFavouritesLoading,
    refetch: refetchFavourites,
  } = useGetFavouritesByFilterQuery({
    favouriter_id: user?.user?.user_id,
    is_active: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const levelId = Number(playerLevelId) ?? null;
  const selectedGender = gender ?? "";
  const locationIdValue = Number(locationId) ?? null;

  const {
    data: players,
    isLoading: isPlayersLoading,
    refetch: refetchPaginatedPlayers,
  } = useGetPaginatedPlayersQuery({
    currentPage: currentPage,
    playerLevelId: levelId,
    selectedGender: selectedGender,
    locationId: locationIdValue,
    currentUserId: user?.user?.user_id,
    textSearch: textSearch,
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

  const filteredPlayers = players?.players?.filter((player) => {
    if (favourite !== true) {
      return player;
    } else if (
      (favourite === true &&
        myFavourites.find(
          (favourite) => favourite.favouritee_id === player.user_id
        )) ||
      favourite !== true
    ) {
      return player;
    }
  });

  useEffect(() => {
    refetchPaginatedPlayers();
  }, [levelId, selectedGender, locationIdValue, textSearch]);

  useEffect(() => {
    refetchFavourites();
  }, []);

  if (isPlayersLoading || isFavouritesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <h2 className={styles["title"]}>Antreman</h2>
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
              <th>Oyuncu</th>
              <th>İsim</th>
              <th>Seviye</th>
              <th>Cinsiyet</th>
              <th>Yaş</th>
              <th>Konum</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr key={player.player_id} className={styles["player-row"]}>
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
                  >{`${player.fname} ${player.lname}`}</Link>
                </td>
                <td>{player?.player_level_name}</td>
                <td>{player.gender}</td>
                <td>{getAge(Number(player.birth_year))}</td>
                <td>{player?.location_name}</td>
                <td>
                  <button
                    onClick={() => handleOpenInviteModal(player?.user_id)}
                    className={styles["training-button"]}
                  >
                    Davet gönder
                  </button>
                </td>
                <td>
                  <SlOptions className={styles.icon} />
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
        <TrainingInviteFormModal
          opponentUserId={opponentUserId}
          isInviteModalOpen={isInviteModalOpen}
          handleCloseInviteModal={handleCloseInviteModal}
        />
      )}
    </div>
  );
};

export default TrainResults;
