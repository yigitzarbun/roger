import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";
import Paths from "../../../../../../routing/Paths";
import { ImBlocked } from "react-icons/im";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import { getAge } from "../../../../../../common/util/TimeFunctions";
import { imageUrl } from "../../../../../../common/constants/apiConstants";
import PageLoading from "../../../../../../components/loading/PageLoading";
import {
  useAddFavouriteMutation,
  useGetFavouritesByFilterQuery,
  useUpdateFavouriteMutation,
} from "../../../../../../../api/endpoints/FavouritesApi";

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

  const { t } = useTranslation();

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
          <h1>{t("subscribersTitle")}</h1>
        </div>
        <div className={styles["table-container"]}>
          {selectedClubSubscribers?.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>{t("tablePlayerHeader")}</th>
                  <th>{t("tableNameHeader")}</th>
                  <th>{t("tableGenderHeader")}</th>
                  <th>{t("tableAgeHeader")}</th>
                  <th>{t("tableLocationHeader")}</th>
                  <th>{t("tableLevelHeader")}</th>
                  <th>{t("reviewsTitle")}</th>
                  {isUserPlayer && <th>{t("trainTitle")}</th>}
                  {isUserPlayer && <th>{t("matchTitle")}</th>}
                  {isUserTrainer && <th>{t("lessonTitle")}</th>}
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
                            : player.externalUserId
                            ? player.externalUserId
                            : null
                        }`}
                      >
                        <img
                          src={
                            player.playerImage
                              ? `${imageUrl}/${player.playerImage}`
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
                            : player.externalUserId
                            ? player.externalUserId
                            : null
                        }`}
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
                      {player.playerGenderName &&
                      player.playerGenderName === "male"
                        ? t("male")
                        : player.playerGenderName &&
                          player.playerGenderName === "female"
                        ? t("female")
                        : player.externalGenderName &&
                          player.externalGenderName === "male"
                        ? t("male")
                        : player.externalGenderName &&
                          player.externalGenderName === "female"
                        ? t("female")
                        : ""}
                    </td>
                    <td>
                      {getAge(
                        player.playerBirthYear
                          ? player.playerBirthYear
                          : player.externalBirthYear
                          ? player.externalBirthYear
                          : null
                      )}
                    </td>
                    <td>
                      {player.locationName
                        ? player.locationName
                        : player.externalLocationName
                        ? player.externalLocationName
                        : ""}
                    </td>
                    <td>
                      {player.playerLevelName && player.playerLevelId === 1
                        ? t("playerLevelBeginner")
                        : player.playerLevelName && player?.playerLevelId === 2
                        ? t("playerLevelIntermediate")
                        : player.playerLevelName && player?.playerLevelId === 3
                        ? t("playerLevelAdvanced")
                        : player.playerLevelName && player?.playerLevelId === 4
                        ? t("playerLevelProfessinal")
                        : player.externalLevelName &&
                          player.externalLevelId === 1
                        ? t("playerLevelBeginner")
                        : player.externalLevelName &&
                          player?.externalLevelId === 2
                        ? t("playerLevelIntermediate")
                        : player.externalLevelName &&
                          player?.externalLevelId === 3
                        ? t("playerLevelAdvanced")
                        : player.externalLevelName &&
                          player?.externalLevelId === 4
                        ? t("playerLevelProfessinal")
                        : ""}
                    </td>
                    <td>
                      {player.reviewscorecount > 0
                        ? `${Math.round(
                            Number(player.averagereviewscore)
                          )} / 10`
                        : "-"}
                    </td>
                    <td>
                      {isUserPlayer &&
                      player.playerUserId !== user?.user?.user_id &&
                      player.user_type_id === 1 ? (
                        <button
                          onClick={() =>
                            handleOpenTrainInviteModal(player.playerUserId)
                          }
                        >
                          {t("trainInviteTitle")}
                        </button>
                      ) : isUserPlayer &&
                        (player.playerUserId === user?.user?.user_id ||
                          player.user_type_id !== 1) ? (
                        <ImBlocked className={styles.blocked} />
                      ) : isUserPlayer &&
                        user?.playerDetails?.gender ===
                          player.playerGenderName &&
                        player.playerUserId !== user?.user?.user_id &&
                        player.user_type_id === 1 ? (
                        <button
                          onClick={() =>
                            handleOpenMatchInviteModal(player.playerUserId)
                          }
                          disabled={
                            user?.playerDetails?.gender !==
                            player.playerGenderName
                          }
                        >
                          {t("matchInviteTitle")}
                        </button>
                      ) : isUserPlayer &&
                        (user?.playerDetails?.gender !==
                          player.playerGenderName ||
                          player.playerUserId === user?.user?.user_id ||
                          player.user_type_id !== 1) ? (
                        <ImBlocked className={styles.blocked} />
                      ) : isUserTrainer && player.user_type_id === 1 ? (
                        <button
                          onClick={() =>
                            handleOpenLessonModal(player.playerUserId)
                          }
                        >
                          {t("lessonInviteTitle")}
                        </button>
                      ) : (
                        ""
                      )}
                    </td>
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
