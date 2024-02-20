import React, { useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../../../routing/Paths";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import styles from "./styles.module.scss";

import PageLoading from "../../../../../../components/loading/PageLoading";

import { Club } from "../../../../../../api/endpoints/ClubsApi";
import { useGetClubStaffByFilterQuery } from "../../../../../../api/endpoints/ClubStaffApi";
import { useGetTrainersQuery } from "../../../../../../api/endpoints/TrainersApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../../../api/endpoints/TrainerExperienceTypesApi";

import { useAppSelector } from "../../../../../../store/hooks";

import ExploreClubTrainerModal from "../../modals/trainers/ExploreClubTrainersModal";
import ClubEmploymentModal from "../../../../../../components/explore/explore-results/explore-clubs/employment-modal/ClubEmploymentModal";

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
    useGetClubStaffByFilterQuery({
      club_id: selectedClub?.[0]?.club_id,
      employment_status: "accepted",
      club_staff_role_type_id: 2,
    });

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  let confirmedClubTrainers = [];
  clubStaffTrainers?.forEach((clubTrainer) => {
    const trainerDetails = trainers?.find(
      (trainer) => trainer.user_id === clubTrainer.user_id
    );
    if (trainerDetails) {
      confirmedClubTrainers.push(trainerDetails);
    }
  });

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

  if (
    isTrainersLoading ||
    isTrainerExperienceTypesLoading ||
    isClubStaffLoading
  ) {
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
      {confirmedClubTrainers?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>İsim</th>
              <th>Soyisim</th>
              <th>Cinsiyet</th>
              <th>Tecrübe</th>
              <th>Fiyat</th>
            </tr>
          </thead>
          <tbody>
            {confirmedClubTrainers
              ?.slice(confirmedClubTrainers.length - 2)
              ?.map((trainer) => (
                <tr key={trainer.user_id}>
                  <td>
                    <Link to={`${paths.EXPLORE_PROFILE}2/${trainer.user_id} `}>
                      <img
                        src={
                          trainer.image
                            ? `${localUrl}/${trainer.image}`
                            : "/images/icons/avatar.png"
                        }
                        alt="trainer picture"
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
                  <td>{trainer.price_hour}</td>

                  {isUserPlayer && (
                    <td>
                      <Link
                        to={paths.LESSON_INVITE}
                        state={{
                          fname: trainer.fname,
                          lname: trainer.lname,
                          image: trainer.image,
                          court_price: "",
                          user_id: trainer.user_id,
                        }}
                        className={styles["lesson-button"]}
                      >
                        Derse davet et
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>Henüz kulübe bağlı çalışan eğitmen bulunmamaktadır</p>
      )}
      <button onClick={openTrainersModal}>Tümünü Görüntüle</button>
      {isTrainersModalOpen && (
        <ExploreClubTrainerModal
          isTrainersModalOpen={isTrainersModalOpen}
          closeTrainersModal={closeTrainersModal}
          confirmedClubTrainers={confirmedClubTrainers}
        />
      )}
      {employmentModalOpen && (
        <ClubEmploymentModal
          employmentModalOpen={employmentModalOpen}
          closeEmploymentModal={closeEmploymentModal}
          trainerEmploymentClubId={trainerEmploymentClubId}
        />
      )}
    </div>
  );
};
export default ExploreClubsTrainersSection;
