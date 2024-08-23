import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ImBlocked } from "react-icons/im";
import styles from "./styles.module.scss";
import ExploreClubSubscribersModal from "../../modals/subscribers/ExploreClubSubscribersModal";
import { localUrl } from "../../../../../../common/constants/apiConstants";
import { useGetClubSubscribersByIdQuery } from "../../../../../../api/endpoints/ClubSubscriptionsApi";
import { getAge } from "../../../../../../common/util/TimeFunctions";
import Paths from "../../../../../../routing/Paths";
import TrainingInviteFormModal from "../../../../../../components/invite/training/form/TrainingInviteFormModal";
import MatchInviteFormModal from "../../../../../../components/invite/match/form/MatchInviteFormModal";
import LessonInviteFormModal from "../../../../../../components/invite/lesson/form/LessonInviteFormModal";

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
      <h2>Üyeler</h2>
      {clubSubscribers?.length > 0 ? (
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
              {isUserTrainer && <th>Ders</th>}
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
                    {player.playerGenderName
                      ? player.playerGenderName
                      : player.externalGenderName
                      ? player.externalGenderName
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
                    {player.playerLevelName
                      ? player.playerLevelName
                      : player.externalLevelName
                      ? player.externalLevelName
                      : ""}
                  </td>
                  <td>
                    {player.reviewscorecount > 0
                      ? `${Math.round(Number(player.averagereviewscore))} / 10`
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
                      {user?.playerDetails?.gender ===
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
      {clubSubscribers?.length > 0 && (
        <button onClick={openSubscribersModal}>Tümünü Gör</button>
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
