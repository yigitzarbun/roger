import React, { useEffect, useState } from "react";
import { FiMessageSquare } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

import { localUrl } from "../../../../../../common/constants/apiConstants";
import { IoStar } from "react-icons/io5";

import styles from "./styles.module.scss";

import PageLoading from "../../../../../../components/loading/PageLoading";

import { useGetPlayerByUserIdQuery } from "../../../../../../api/endpoints/PlayersApi";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useUpdateFavouriteMutation,
} from "../../../../../../api/endpoints/FavouritesApi";
import { useAppSelector } from "../../../../../../store/hooks";
import { getAge } from "../../../../../../common/util/TimeFunctions";
import TrainingInviteFormModal from "../../../../../../components/invite/training/form/TrainingInviteFormModal";
import MatchInviteFormModal from "../../../../../../components/invite/match/form/MatchInviteFormModal";
import LessonInviteFormModal from "../../../../../../components/invite/lesson/form/LessonInviteFormModal";
import MessageModal from "../../../../../messages/modals/message-modal/MessageModal";

interface ExplorePlayersInteractionsSectionsProps {
  selectedPlayer: any;
  user_id: number;
}

const ExplorePlayersInteractionsSections = (
  props: ExplorePlayersInteractionsSectionsProps
) => {
  const { selectedPlayer, user_id } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const generateStars = (count) => {
    const stars = [];
    for (let i = 0; i < 10; i++) {
      if (i < count) {
        stars.push(<IoStar className={styles["active-star"]} key={i} />);
      } else {
        stars.push(<IoStar className={styles["empty-star"]} key={i} />);
      }
    }
    return stars;
  };

  const isUserPlayer = user?.user?.user_type_id === 1;
  const isUserTrainer = user?.user?.user_type_id === 2;
  const profileImage = selectedPlayer?.image;

  const { data: currentPlayer, isLoading: isCurrentPlayerLoading } =
    useGetPlayerByUserIdQuery(user?.user?.user_id);

  const userGender = currentPlayer?.[0]?.gender;

  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const handleOpenTrainingModal = () => {
    setIsTrainingModalOpen(true);
  };
  const handleCloseTrainingModal = () => {
    setIsTrainingModalOpen(false);
  };
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  const handleOpenMatchModal = () => {
    setIsMatchModalOpen(true);
  };
  const handleCloseMatchModal = () => {
    setIsMatchModalOpen(false);
  };
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const handleOpenLessonModal = () => {
    setIsLessonModalOpen(true);
  };
  const handleCloseLessonModal = () => {
    setIsLessonModalOpen(false);
  };

  const {
    data: myFavouritePlayers,
    isLoading: isMyFavouritePlayersLoading,
    refetch: refetchMyFavourites,
  } = useGetFavouritesByFilterQuery({
    favouriter_id: user?.user?.user_id,
  });

  const isPlayerInMyFavourites = (user_id: number) => {
    return myFavouritePlayers?.find(
      (player) => player.favouritee_id === user_id
    );
  };

  const [addFavourite, { isSuccess: isAddFavouriteSuccess }] =
    useAddFavouriteMutation();

  const [updateFavourite, { isSuccess: isUpdateFavouriteSuccess }] =
    useUpdateFavouriteMutation();

  const handleAddFavourite = (favouritee_id: number) => {
    const favouriteData = {
      is_active: true,
      favouriter_id: user?.user?.user_id,
      favouritee_id: favouritee_id,
    };
    addFavourite(favouriteData);
  };

  const handleUpdateFavourite = (userId: number) => {
    const selectedFavourite = myFavouritePlayers?.find(
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
    if (isPlayerInMyFavourites(userId)) {
      handleUpdateFavourite(userId);
    } else {
      handleAddFavourite(userId);
    }
  };

  const [messageModal, setMessageModal] = useState(false);
  const handleOpenMessageModal = () => {
    setMessageModal(true);
  };
  const closeMessageModal = () => {
    setMessageModal(false);
  };

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetchMyFavourites();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  if (isMyFavouritePlayersLoading || isCurrentPlayerLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["interaction-section"]}>
      <div className={styles["image-container"]}>
        <img
          src={
            profileImage
              ? `${localUrl}/${profileImage}`
              : "/images/icons/avatar.jpg"
          }
          alt="player picture"
          className={styles["profile-image"]}
        />

        <div className={styles["name-container"]}>
          <h2>{`${selectedPlayer?.fname} ${selectedPlayer?.lname}`}</h2>
          <h4>Oyuncu</h4>
          <div className={styles.reviews}>
            {selectedPlayer?.averagereviewscore?.length > 0 &&
              generateStars(selectedPlayer?.averagereviewscore).map(
                (star, index) => <span key={index}>{star}</span>
              )}
            {selectedPlayer?.averagereviewscore?.length > 0 && (
              <p className={styles["reviews-text"]}>
                {selectedPlayer?.reviewscorecount} değerlendirme
              </p>
            )}
          </div>
        </div>
      </div>

      <div className={styles["bio-container"]}>
        <div className={styles["top-container"]}>
          <div className={styles["table-container"]}>
            <table>
              <thead>
                <tr>
                  <th>Yaş</th>
                  <th>Cinsiyet</th>
                  <th>Konum</th>
                  <th>Seviye</th>
                  <th>Maç</th>
                  <th>W</th>
                  <th>L</th>
                  <th>Puan</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles["player-row"]}>
                  <td>{getAge(Number(selectedPlayer?.birth_year))}</td>
                  <td>{selectedPlayer?.gender}</td>
                  <td>{selectedPlayer?.location_name}</td>
                  <td>{selectedPlayer?.player_level_name}</td>
                  <td>{selectedPlayer?.totalmatches}</td>
                  <td className={styles["win-count"]}>
                    {selectedPlayer?.wonmatches}
                  </td>
                  <td className={styles["lost-count"]}>
                    {selectedPlayer?.lostmatches}
                  </td>
                  <td className={styles["points-count"]}>
                    {selectedPlayer?.playerpoints}
                  </td>
                </tr>
              </tbody>
            </table>
            {user_id !== user?.user?.user_id && (
              <div className={styles["buttons-container"]}>
                <div className={styles.icons}>
                  {isPlayerInMyFavourites(selectedPlayer?.user_id)
                    ?.is_active === true ? (
                    <AiFillStar
                      className={styles["remove-fav-icon"]}
                      onClick={() =>
                        handleToggleFavourite(selectedPlayer?.user_id)
                      }
                    />
                  ) : (
                    <AiOutlineStar
                      className={styles["add-fav-icon"]}
                      onClick={() =>
                        handleToggleFavourite(selectedPlayer?.user_id)
                      }
                    />
                  )}
                  <FiMessageSquare
                    className={styles.message}
                    onClick={handleOpenMessageModal}
                  />
                </div>
                <div className={styles["interaction-buttons"]}>
                  {isUserPlayer && (
                    <button
                      onClick={handleOpenTrainingModal}
                      className={styles["interaction-button"]}
                    >
                      Antreman yap
                    </button>
                  )}
                  {isUserPlayer && selectedPlayer?.gender === userGender && (
                    <button
                      onClick={handleOpenMatchModal}
                      className={styles["interaction-button"]}
                    >
                      Maç yap
                    </button>
                  )}
                  {isUserTrainer && (
                    <button
                      onClick={handleOpenLessonModal}
                      className={styles["interaction-button"]}
                    >
                      Derse davet et
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isTrainingModalOpen && (
        <TrainingInviteFormModal
          opponentUserId={user_id}
          isInviteModalOpen={isTrainingModalOpen}
          handleCloseInviteModal={handleCloseTrainingModal}
        />
      )}
      {isMatchModalOpen && (
        <MatchInviteFormModal
          opponentUserId={user_id}
          isInviteModalOpen={isMatchModalOpen}
          handleCloseInviteModal={handleCloseMatchModal}
        />
      )}
      {isLessonModalOpen && (
        <LessonInviteFormModal
          opponentUserId={user_id}
          isInviteModalOpen={isLessonModalOpen}
          handleCloseInviteModal={handleCloseLessonModal}
          isUserPlayer={isUserPlayer}
          isUserTrainer={isUserTrainer}
        />
      )}
      {messageModal && (
        <MessageModal
          messageModal={messageModal}
          closeMessageModal={closeMessageModal}
          recipient_id={selectedPlayer?.user_id}
        />
      )}
    </div>
  );
};

export default ExplorePlayersInteractionsSections;
