import React, { useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../../../routing/Paths";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import styles from "./styles.module.scss";

import PageLoading from "../../../../../../components/loading/PageLoading";

import { useGetClubTrainersQuery } from "../../../../../../api/endpoints/ClubStaffApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../../../api/endpoints/TrainerExperienceTypesApi";

import { useAppSelector } from "../../../../../../store/hooks";

import ExploreClubTrainerModal from "../../modals/trainers/ExploreClubTrainersModal";
import ClubEmploymentModal from "../../../../../../components/explore/explore-results/explore-clubs/employment-modal/ClubEmploymentModal";
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

  const user = useAppSelector((store) => store?.user?.user);

  const { data: clubStaffTrainers, isLoading: isClubStaffLoading } =
    useGetClubTrainersQuery(selectedClub?.[0]?.club_id);
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

  const [employmentModalOpen, setEmploymentModalOpen] = useState(false);
  const [trainerEmploymentClubId, setTrainerEmploymentClubId] = useState(null);
  const openEmploymentModal = (club_id: number) => {
    setTrainerEmploymentClubId(club_id);
    setEmploymentModalOpen(true);
  };
  const closeEmploymentModal = () => {
    setEmploymentModalOpen(false);
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
        {isUserTrainer &&
        clubStaffTrainers?.find(
          (staff) =>
            staff.club_id === selectedClub?.[0]?.club_id &&
            staff.user_id === user?.user?.user_id &&
            staff.employment_status === "accepted"
        ) ? (
          <p className={styles["employed-text"]}>Bu kulüpte çalışıyorsun</p>
        ) : isUserTrainer &&
          clubStaffTrainers?.find(
            (staff) =>
              staff.club_id === selectedClub?.[0]?.club_id &&
              staff.user_id === user?.user?.user_id &&
              staff.employment_status === "pending"
          ) ? (
          <p className={styles["employment-pending-text"]}>
            Başvurun henüz yanıtlanmadı
          </p>
        ) : (
          isUserTrainer && (
            <button
              onClick={() => openEmploymentModal(selectedClub?.[0]?.club_id)}
            >
              Bu kulüpte çalıştığına dair kulübe başvur
            </button>
          )
        )}
      </div>
      {clubStaffTrainers?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Eğitmen</th>
              <th>İsim</th>
              <th>Soyisim</th>
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
                  <td>{trainer.fname}</td>
                  <td>{trainer.lname}</td>
                  <td>{trainer.gender}</td>
                  <td>
                    {
                      trainerExperienceTypes?.find(
                        (type) =>
                          type.trainer_experience_type_id ===
                          trainer.trainer_experience_type_id
                      )?.trainer_experience_type_name
                    }
                  </td>
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
      {employmentModalOpen && (
        <ClubEmploymentModal
          employmentModalOpen={employmentModalOpen}
          closeEmploymentModal={closeEmploymentModal}
          trainerEmploymentClubId={trainerEmploymentClubId}
        />
      )}
      {isInviteModalOpen && (
        <LessonInviteFormModal
          opponentUserId={trainerLessonUserId}
          isInviteModalOpen={isInviteModalOpen}
          handleCloseInviteModal={handleCloseInviteModal}
        />
      )}
    </div>
  );
};
export default ExploreClubsTrainersSection;
