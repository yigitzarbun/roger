import React, { useState } from "react";
import ReactModal from "react-modal";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import paths from "../../../../../../routing/Paths";
import { imageUrl } from "../../../../../../common/constants/apiConstants";
import { useAppSelector } from "../../../../../../store/hooks";
import { useTranslation } from "react-i18next";
import { getAge } from "../../../../../../common/util/TimeFunctions";
import LessonInviteFormModal from "../../../../../../components/invite/lesson/form/LessonInviteFormModal";

interface ExploreClubTrainersModalProps {
  isTrainersModalOpen: boolean;
  closeTrainersModal: () => void;
  confirmedClubTrainers: any[];
}

const ExploreClubTrainerModal = (props: ExploreClubTrainersModalProps) => {
  const { isTrainersModalOpen, closeTrainersModal, confirmedClubTrainers } =
    props;

  const { t } = useTranslation();

  const user = useAppSelector((store) => store?.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;

  const isUserTrainer = user?.user?.user_type_id === 2;

  const [trainerLessonUserId, setTrainerLessonUserId] = useState(null);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleOpenLessonModal = (trainerLessonUserId: number) => {
    setTrainerLessonUserId(trainerLessonUserId);
    setIsInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  return (
    <ReactModal
      isOpen={isTrainersModalOpen}
      onRequestClose={closeTrainersModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeTrainersModal} />
      <div className={styles["modal-content"]}>
        <div className={styles["top-container"]}>
          <h1>{t("exploreTrainersTabTitle")}</h1>
        </div>
        <div className={styles["table-container"]}>
          {confirmedClubTrainers?.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>{t("tableTrainerHeader")}</th>
                  <th>{t("tableNameHeader")}</th>
                  <th>{t("tableGenderHeader")}</th>
                  <th>{t("tableAgeHeader")}</th>
                  <th>{t("tableLevelHeader")}</th>
                  <th>{t("tableLocationHeader")}</th>
                  <th>{t("tableLessonHeader")}</th>
                  <th>{t("tableStudentshipHeader")}</th>
                  <th>{t("tablePriceHeader")}</th>
                  {isUserPlayer && <th>Ders</th>}
                </tr>
              </thead>
              <tbody>
                {confirmedClubTrainers?.map((trainer) => (
                  <tr key={trainer.user_id} className={styles["trainer-row"]}>
                    <td>
                      <Link
                        to={`${paths.EXPLORE_PROFILE}2/${trainer.trainerUserId} `}
                      >
                        <img
                          src={
                            trainer.trainerImage
                              ? `${imageUrl}/${trainer.trainerImage}`
                              : "/images/icons/avatar.jpg"
                          }
                          alt="trainer picture"
                          className={styles["trainer-image"]}
                        />
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`${paths.EXPLORE_PROFILE}2/${trainer.trainerUserId} `}
                        className={styles["trainer-name"]}
                      >
                        {`${trainer.fname} ${trainer.lname}`}
                      </Link>
                    </td>
                    <td>
                      {trainer.gender === "female" ? t("female") : t("male")}
                    </td>
                    <td>{getAge(trainer.birth_year)}</td>
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
            <p>Henüz kulübe bağlı çalışan eğitmen bulunmamaktadır</p>
          )}
        </div>
      </div>
      {isInviteModalOpen && (
        <LessonInviteFormModal
          opponentUserId={trainerLessonUserId}
          isInviteModalOpen={isInviteModalOpen}
          handleCloseInviteModal={handleCloseInviteModal}
          isUserPlayer={isUserPlayer}
          isUserTrainer={isUserTrainer}
        />
      )}
    </ReactModal>
  );
};
export default ExploreClubTrainerModal;
