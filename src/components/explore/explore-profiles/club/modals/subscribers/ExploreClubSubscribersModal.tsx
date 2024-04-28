import React, { useEffect } from "react";

import ReactModal from "react-modal";

import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import Paths from "../../../../../../routing/Paths";
import { ImBlocked } from "react-icons/im";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import { getAge } from "../../../../../../common/util/TimeFunctions";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import PageLoading from "../../../../../../components/loading/PageLoading";

import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useUpdateFavouriteMutation,
} from "../../../../../../api/endpoints/FavouritesApi";

interface ExploreClubSubscribersModalProps {
  isSubscribersModalOpen: boolean;
  closeSubscribersModal: () => void;
  selectedClubSubscribers: any[];
  user: any;
  handleOpenTrainInviteModal: (userId: number) => void;
  handleOpenMatchInviteModal: (userId: number) => void;
  handleOpenLessonModal: (userId: number) => void;
}

const ExploreClubSubscribersModal = (
  props: ExploreClubSubscribersModalProps
) => {
  const {
    isSubscribersModalOpen,
    closeSubscribersModal,
    selectedClubSubscribers,
    user,
    handleOpenTrainInviteModal,
    handleOpenMatchInviteModal,
    handleOpenLessonModal,
  } = props;

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

  const isUserPlayer = user?.user?.user_type_id === 1;

  const isUserTrainer = user?.user?.user_type_id === 2;

  useEffect(() => {
    if (isAddFavouriteSuccess || isUpdateFavouriteSuccess) {
      refetchMyFavourites();
    }
  }, [isAddFavouriteSuccess, isUpdateFavouriteSuccess]);

  if (isMyFavouritesLoading) {
    return <PageLoading />;
  }

  return (
    <ReactModal
      isOpen={isSubscribersModalOpen}
      onRequestClose={closeSubscribersModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeSubscribersModal} />
      <div className={styles["modal-content"]}>
        <div className={styles["top-container"]}>
          <h1>Üyeler</h1>
        </div>
        <div className={styles["table-container"]}>
          {selectedClubSubscribers?.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Üye</th>
                  <th>İsim</th>
                  <th>Cinsiyet</th>
                  <th>Yaş</th>
                  <th>Konum</th>
                  <th>Seviye</th>
                  <th>Yorum</th>
                  {isUserPlayer && <th>Antreman</th>}
                  {isUserPlayer && <th>Maç</th>}
                  {isUserTrainer && <td>Ders</td>}
                </tr>
              </thead>
              <tbody>
                {selectedClubSubscribers.map((player) => (
                  <tr
                    key={player.playerUserId}
                    className={styles["subscriber-row"]}
                  >
                    <td>
                      <Link
                        to={`${Paths.EXPLORE_PROFILE}1/${
                          player.playerUserId
                            ? player.playerUserId
                            : player.user_id
                        } `}
                      >
                        <img
                          src={
                            player.playerImage
                              ? `${localUrl}/${player.playerImage}`
                              : "/images/icons/avatar.jpg"
                          }
                          className={styles["subscriber-image"]}
                        />
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`${Paths.EXPLORE_PROFILE}1/${
                          player.playerUserId
                            ? player.playerUserId
                            : player.user_id
                        } `}
                        className={styles["subscriber-name"]}
                      >
                        {player.user_type_id === 1
                          ? `${player.playerFname} ${player.playerLname}`
                          : player.user_type_id === 5
                          ? `${player.externalFname} ${player.externalLname}`
                          : ""}
                      </Link>
                    </td>
                    <td>
                      {player.playerGenderName
                        ? player.playerGenderName
                        : player.externalGenderName
                        ? player.externalGenderName
                        : ""}
                    </td>
                    <td>
                      {getAge(
                        player.birth_year
                          ? player.birth_year
                          : player.externalBirthYear
                          ? player.externalBirthYear
                          : null
                      )}
                    </td>
                    <td>
                      {player.location_name
                        ? player.location_name
                        : player.externalLocationName
                        ? player.externalLocationName
                        : ""}
                    </td>
                    <td>
                      {player.playerLevelName
                        ? player.playerLevelName
                        : player.externalLevelName
                        ? player.externalLevelName
                        : ""}
                    </td>
                    <td>
                      {player.reviewscorecount > 0
                        ? `${Math.round(
                            Number(player.averagereviewscore)
                          )} / 10`
                        : "-"}
                    </td>
                    {isUserPlayer && (
                      <td>
                        {player.playerUserId !== user?.user?.user_id &&
                        player.user_type_id === 1 ? (
                          <button
                            onClick={() =>
                              handleOpenTrainInviteModal(player.playerUserId)
                            }
                          >
                            Antreman Yap
                          </button>
                        ) : (
                          <ImBlocked className={styles.blocked} />
                        )}
                      </td>
                    )}

                    {isUserPlayer && (
                      <td>
                        {user?.playerDetails?.gender === player.gender &&
                        player.playerUserId !== user?.user?.user_id &&
                        player.user_type_id === 1 ? (
                          <button
                            onClick={() =>
                              handleOpenMatchInviteModal(player.playerUserId)
                            }
                            disabled={
                              user?.playerDetails?.gender !== player.gender
                            }
                          >
                            Maç Yap
                          </button>
                        ) : (
                          <ImBlocked className={styles.blocked} />
                        )}
                      </td>
                    )}
                    {isUserTrainer && player.user_type_id === 1 && (
                      <td>
                        <button
                          onClick={() =>
                            handleOpenLessonModal(player.playerUserId)
                          }
                        >
                          Derse davet et
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Kulübe üye bulunmamaktadır.</p>
          )}
        </div>
      </div>
    </ReactModal>
  );
};

export default ExploreClubSubscribersModal;
