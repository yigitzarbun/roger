import React, { useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../../../routing/Paths";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import styles from "./styles.module.scss";

import PageLoading from "../../../../../../components/loading/PageLoading";

import { useGetClubTrainersQuery } from "../../../../../../api/endpoints/ClubStaffApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../../../api/endpoints/TrainerExperienceTypesApi";

import ExploreClubTrainerModal from "../../modals/trainers/ExploreClubTrainersModal";
import LessonInviteFormModal from "../../../../../../components/invite/lesson/form/LessonInviteFormModal";

interface ExploreClubsTrainersSectionProps {
  isUserTrainer: boolean;
  isUserPlayer: boolean;
  selectedClub: any;
}
const ExploreClubsTrainersSection = (
  props: ExploreClubsTrainersSectionProps
) => {
  const { isUserTrainer, isUserPlayer, selectedClub } = props;

  const { data: clubStaffTrainers, isLoading: isClubStaffLoading } =
    useGetClubTrainersQuery(selectedClub?.[0]?.user_id);

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

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
  if (isTrainerExperienceTypesLoading || isClubStaffLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["trainers-section"]}>
      <div className={styles["trainers-section-title-container"]}>
        <h2>Eğitmenler</h2>
      </div>
      {clubStaffTrainers?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Eğitmen</th>
              <th>İsim</th>
              <th>Cinsiyet</th>
              <th>Tecrübe</th>
              <th>Konum</th>
              <th>Ders</th>
              <th>Öğrenci</th>
              <th>Fiyat</th>
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
                  <td>{trainer.gender}</td>
                  <td>{trainer?.trainer_experience_type_name}</td>
                  <td>{trainer.location_name}</td>
                  <td>{trainer.lessoncount}</td>
                  <td>{trainer.studentcount}</td>
                  <td>{trainer.price_hour}</td>

                  {isUserPlayer && (
                    <td>
                      <button
                        onClick={() =>
                          handleOpenLessonModal(trainer.trainerUserId)
                        }
                        className={styles["lesson-button"]}
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
        <p>Henüz kulübe bağlı çalışan eğitmen bulunmamaktadır</p>
      )}
      {clubStaffTrainers?.length > 0 && (
        <button onClick={openTrainersModal}>Tümünü Görüntüle</button>
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
