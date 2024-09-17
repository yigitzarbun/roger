import React, { useState } from "react";
import { Link } from "react-router-dom";
import paths from "../../../../../../routing/Paths";
import { localUrl } from "../../../../../../common/constants/apiConstants";
import styles from "./styles.module.scss";
import PageLoading from "../../../../../../components/loading/PageLoading";
import { useGetClubTrainersQuery } from "../../../../../../../api/endpoints/ClubStaffApi";
import ExploreClubTrainerModal from "../../modals/trainers/ExploreClubTrainersModal";
import LessonInviteFormModal from "../../../../../../components/invite/lesson/form/LessonInviteFormModal";
import { useTranslation } from "react-i18next";

interface ExploreClubsTrainersSectionProps {
  isUserTrainer: boolean;
  isUserPlayer: boolean;
  selectedClub: any;
}
const ExploreClubsTrainersSection = (
  props: ExploreClubsTrainersSectionProps
) => {
  const { isUserTrainer, isUserPlayer, selectedClub } = props;

  const { t } = useTranslation();

  const { data: clubStaffTrainers, isLoading: isClubStaffLoading } =
    useGetClubTrainersQuery(selectedClub?.[0]?.user_id);

  const [isTrainersModalOpen, setIsTrainersModalOpen] = useState(false);

  const openTrainersModal = () => {
    setIsTrainersModalOpen(true);
  };

  const closeTrainersModal = () => {
    setIsTrainersModalOpen(false);
  };

  const [trainerLessonUserId, setTrainerLessonUserId] = useState(null);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleOpenLessonModal = (trainerLessonUserId: number) => {
    setTrainerLessonUserId(trainerLessonUserId);
    setIsInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  if (isClubStaffLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["trainers-section"]}>
      <div className={styles["trainers-section-title-container"]}>
        <h2>{t("exploreTrainersTabTitle")}</h2>
      </div>
      {clubStaffTrainers?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{t("tableTrainerHeader")}</th>
              <th>{t("tableNameHeader")}</th>
              <th>{t("tableGenderHeader")}</th>
              <th>{t("tableLevelHeader")}</th>
              <th>{t("tableLocationHeader")}</th>
              <th>{t("tableLessonHeader")}</th>
              <th>{t("tableStudentshipHeader")}</th>
              <th>{t("tablePriceHeader")}</th>
            </tr>
          </thead>
          <tbody>
            {clubStaffTrainers
              ?.slice(clubStaffTrainers.length - 2)
              ?.map((trainer) => (
                <tr
                  key={trainer.trainerUserId}
                  className={styles["trainer-row"]}
                >
                  <td>
                    <Link
                      to={`${paths.EXPLORE_PROFILE}2/${trainer.trainerUserId} `}
                    >
                      <img
                        src={
                          trainer.trainerImage
                            ? `${localUrl}/${trainer.trainerImage}`
                            : "/images/icons/avatar.jpg"
                        }
                        alt="trainer_image"
                        className={styles["trainer-image"]}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`${paths.EXPLORE_PROFILE}2/${trainer.trainerUserId} `}
                      className={styles["trainer-name"]}
                    >{`${trainer.fname} ${trainer.lname}`}</Link>
                  </td>
                  <td>
                    {trainer.gender === "female" ? t("female") : t("male")}
                  </td>
                  <td>
                    {trainer?.trainer_experience_type_id === 1
                      ? t("trainerLevelBeginner")
                      : trainer?.trainer_experience_type_id === 2
                      ? t("trainerLevelIntermediate")
                      : trainer?.trainer_experience_type_id === 3
                      ? t("trainerLevelAdvanced")
                      : t("trainerLevelProfessional")}
                  </td>
                  <td>{trainer.location_name}</td>
                  <td>{trainer.lessoncount}</td>
                  <td>{trainer.studentcount}</td>
                  <td>{trainer.price_hour} TL</td>

                  {isUserPlayer && (
                    <td>
                      <button
                        onClick={() =>
                          handleOpenLessonModal(trainer.trainerUserId)
                        }
                        className={styles["lesson-button"]}
                      >
                        {t("tableLessonButtonText")}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>{t("clubHasNoTrainers")}</p>
      )}
      {clubStaffTrainers?.length > 0 && (
        <button onClick={openTrainersModal}>
          {t("leaderBoardViewAllButtonText")}
        </button>
      )}

      {isTrainersModalOpen && (
        <ExploreClubTrainerModal
          isTrainersModalOpen={isTrainersModalOpen}
          closeTrainersModal={closeTrainersModal}
          confirmedClubTrainers={clubStaffTrainers}
        />
      )}
      {isInviteModalOpen && (
        <LessonInviteFormModal
          opponentUserId={trainerLessonUserId}
          isInviteModalOpen={isInviteModalOpen}
          handleCloseInviteModal={handleCloseInviteModal}
          isUserPlayer={isUserPlayer}
          isUserTrainer={isUserTrainer}
        />
      )}
    </div>
  );
};
export default ExploreClubsTrainersSection;
