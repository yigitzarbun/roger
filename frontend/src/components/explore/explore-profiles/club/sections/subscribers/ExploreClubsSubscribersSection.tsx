import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ImBlocked } from "react-icons/im";
import styles from "./styles.module.scss";
import ExploreClubSubscribersModal from "../../modals/subscribers/ExploreClubSubscribersModal";
import { localUrl } from "../../../../../../common/constants/apiConstants";
import { useGetClubSubscribersByIdQuery } from "../../../../../../../api/endpoints/ClubSubscriptionsApi";
import { getAge } from "../../../../../../common/util/TimeFunctions";
import Paths from "../../../../../../routing/Paths";
import TrainingInviteFormModal from "../../../../../../components/invite/training/form/TrainingInviteFormModal";
import MatchInviteFormModal from "../../../../../../components/invite/match/form/MatchInviteFormModal";
import LessonInviteFormModal from "../../../../../../components/invite/lesson/form/LessonInviteFormModal";
import { useTranslation } from "react-i18next";

interface ExploreClubsSubscribersSectionProps {
  selectedClub: any;
  isUserPlayer: boolean;
  isUserTrainer: boolean;
  user: any;
}
const ExploreClubsSubscribersSection = (
  props: ExploreClubsSubscribersSectionProps
) => {
  const { selectedClub, isUserPlayer, isUserTrainer, user } = props;

  const { t } = useTranslation();

  const { data: clubSubscribers, isLoading: isClubsubscribersLoading } =
    useGetClubSubscribersByIdQuery(selectedClub?.[0]?.user_id);

  const [isSubscribersModalOpen, setIsSubscribersModalOpen] = useState(false);

  const openSubscribersModal = () => {
    setIsSubscribersModalOpen(true);
  };

  const closeSubscribersModal = () => {
    setIsSubscribersModalOpen(false);
  };

  const [opponentUserId, setOpponentUserId] = useState(null);

  const [isTrainInviteModalOpen, setIsTrainInviteModalOpen] = useState(false);

  const handleOpenTrainInviteModal = (userId: number) => {
    setOpponentUserId(userId);
    setIsTrainInviteModalOpen(true);
  };

  const handleCloseTrainInviteModal = () => {
    setIsTrainInviteModalOpen(false);
  };

  const [isMatchInviteModalOpen, setIsMatchInviteModalOpen] = useState(false);

  const handleOpenMatchInviteModal = (userId: number) => {
    setOpponentUserId(userId);
    setIsMatchInviteModalOpen(true);
  };

  const handleCloseMatchInviteModal = () => {
    setIsMatchInviteModalOpen(false);
  };

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const handleOpenLessonModal = (userId: number) => {
    setOpponentUserId(userId);
    setIsLessonModalOpen(true);
  };

  const handleCloseLessonModal = () => {
    setIsLessonModalOpen(false);
  };

  return (
    <div className={styles["subscribers-section"]}>
      <h2>{t("subscribersTitle")}</h2>
      {clubSubscribers?.length > 0 ? (
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
            {clubSubscribers
              ?.slice(clubSubscribers?.length - 2)
              .map((player) => (
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
                      : player.externalLevelName && player.externalLevelId === 1
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
                      ? `${Math.round(Number(player.averagereviewscore))} / 10`
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
                      user?.playerDetails?.gender === player.playerGenderName &&
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
        <p>{t("clubHasNoSubscribers")}</p>
      )}
      {clubSubscribers?.length > 0 && (
        <button onClick={openSubscribersModal}>
          {t("leaderBoardViewAllButtonText")}
        </button>
      )}

      {isSubscribersModalOpen && (
        <ExploreClubSubscribersModal
          isSubscribersModalOpen={isSubscribersModalOpen}
          closeSubscribersModal={closeSubscribersModal}
          selectedClubSubscribers={clubSubscribers}
          user={user}
          handleOpenTrainInviteModal={handleOpenTrainInviteModal}
          handleOpenMatchInviteModal={handleOpenMatchInviteModal}
          handleOpenLessonModal={handleOpenLessonModal}
        />
      )}
      {isTrainInviteModalOpen && (
        <TrainingInviteFormModal
          opponentUserId={opponentUserId}
          isInviteModalOpen={isTrainInviteModalOpen}
          handleCloseInviteModal={handleCloseTrainInviteModal}
        />
      )}
      {isMatchInviteModalOpen && (
        <MatchInviteFormModal
          opponentUserId={opponentUserId}
          isInviteModalOpen={isMatchInviteModalOpen}
          handleCloseInviteModal={handleCloseMatchInviteModal}
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
    </div>
  );
};
export default ExploreClubsSubscribersSection;
