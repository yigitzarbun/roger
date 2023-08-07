import React from "react";

import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetTrainerEmploymentTypesQuery } from "../../../../api/endpoints/TrainerEmploymentTypesApi";

import styles from "./styles.module.scss";

interface ExploreTrainerProfileProps {
  user_id: string;
}
const ExploreTrainerProfile = (props: ExploreTrainerProfileProps) => {
  const { user_id } = props;

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const {
    data: trainerEmploymentTypes,
    isLoading: isTrainerEmploymentTypesLoading,
  } = useGetTrainerEmploymentTypesQuery({});

  const selectedTrainer = trainers?.find(
    (trainer) => trainer.user_id === Number(user_id)
  );

  if (
    isClubsLoading ||
    isLocationsLoading ||
    isLocationsLoading ||
    isTrainersLoading ||
    isTrainerExperienceTypesLoading ||
    isTrainerEmploymentTypesLoading
  ) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <div className={styles["profile-section"]}>
          <h3>Eğitmen</h3>
          <img
            src={
              selectedTrainer?.picture
                ? selectedTrainer?.picture
                : "/images/icons/avatar.png"
            }
            alt="club_picture"
            className={styles["club-image"]}
          />
          <h2>{`${selectedTrainer?.fname} ${selectedTrainer.lname}`}</h2>
          <p>{selectedTrainer?.trainer_bio_description}</p>
          <p>{selectedTrainer?.gender}</p>
          <p>{selectedTrainer?.birth_year}</p>
          <p>
            {
              trainerExperienceTypes?.find(
                (type) =>
                  type.trainer_experience_type_id ===
                  selectedTrainer?.trainer_experience_type_id
              )?.trainer_experience_type_name
            }
          </p>
          <p>
            {
              locations?.find(
                (location) =>
                  location.location_id === selectedTrainer?.location_id
              )?.location_name
            }
          </p>
          <p>
            {
              trainerEmploymentTypes?.find(
                (type) =>
                  type.trainer_employment_type_id ===
                  selectedTrainer?.trainer_employment_type_id
              )?.trainer_employment_type_name
            }
          </p>
          <p>
            {trainerEmploymentTypes?.find(
              (type) =>
                type.trainer_employment_type_id ===
                selectedTrainer?.trainer_employment_type_id
            )?.trainer_employment_type_id === 2 &&
              clubs?.find((club) => club.club_id === selectedTrainer?.club_id)
                ?.club_name}
          </p>
          <p>{`${selectedTrainer?.price_hour} TL / Saat`}</p>
        </div>
        <div className={styles["subscription-section"]}>
          <h3>Üyelik</h3>
          <p>163 üye</p>
          <button>Üye Ol</button>
          <button>Ders Al</button>
        </div>
      </div>
    </div>
  );
};
export default ExploreTrainerProfile;
