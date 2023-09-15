import React from "react";

import { FaGenderless, FaCalendarDays, FaLocationDot } from "react-icons/fa6";
import { CgTennis } from "react-icons/cg";
import { FaUserFriends } from "react-icons/fa";
import { PiMoney } from "react-icons/pi";
import { MdSportsTennis } from "react-icons/md";

import styles from "./styles.module.scss";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import PageLoading from "../../../../../../components/loading/PageLoading";

import { useGetClubStaffByFilterQuery } from "../../../../../../api/endpoints/ClubStaffApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetTrainerEmploymentTypesQuery } from "../../../../../../api/endpoints/TrainerEmploymentTypesApi";
import { Trainer } from "../../../../../../api/endpoints/TrainersApi";
import { useGetLocationsQuery } from "../../../../../../api/endpoints/LocationsApi";
import { Club } from "../../../../../../api/endpoints/ClubsApi";

interface ExploreTrainersProfileSectionProps {
  selectedTrainer: Trainer;
  clubs: Club[];
}
const ExploreTrainersProfileSection = (
  props: ExploreTrainersProfileSectionProps
) => {
  const { selectedTrainer, clubs } = props;

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const {
    data: trainerEmploymentTypes,
    isLoading: isTrainerEmploymentTypesLoading,
  } = useGetTrainerEmploymentTypesQuery({});

  const { data: clubStaff, isLoading: isClubStaffLoading } =
    useGetClubStaffByFilterQuery({
      user_id: selectedTrainer?.[0]?.user_id,
      employment_status: "accepted",
    });

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const trainerExperienceType = (trainer_experience_type_id: number) => {
    return trainerExperienceTypes?.find(
      (type) => type.trainer_experience_type_id === trainer_experience_type_id
    );
  };

  const trainerEmploymentType = (trainer_employment_type_id: number) => {
    return trainerEmploymentTypes?.find(
      (type) => type.trainer_employment_type_id === trainer_employment_type_id
    );
  };
  const location = (location_id: number) => {
    return locations?.find((location) => location.location_id === location_id);
  };

  const club = (club_id: number) => {
    return clubs?.find((club) => club.club_id === club_id);
  };

  if (
    isTrainerExperienceTypesLoading ||
    isTrainerEmploymentTypesLoading ||
    isClubStaffLoading ||
    isLocationsLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["profile-section"]}>
      <h2>Eğitmen</h2>
      <div className={styles["profile-data-container"]}>
        <img
          src={
            selectedTrainer?.[0]?.image
              ? `${localUrl}/${selectedTrainer?.[0]?.image}`
              : "/images/icons/avatar.png"
          }
          alt="trainer_picture"
          className={styles["profile-image"]}
        />
        <div className={styles["secondary-profile-data-container"]}>
          <h3>{`${selectedTrainer?.[0]?.fname} ${selectedTrainer?.[0]?.lname}`}</h3>
          <div className={styles["profile-info"]}>
            <FaGenderless className={styles.icon} />
            <p className={styles["info-text"]}>
              {selectedTrainer?.[0]?.gender}
            </p>
          </div>
          <div className={styles["profile-info"]}>
            <FaCalendarDays className={styles.icon} />
            <p className={styles["info-text"]}>
              {selectedTrainer?.[0]?.birth_year}
            </p>
          </div>
          <div className={styles["profile-info"]}>
            <CgTennis className={styles.icon} />
            <p className={styles["info-text"]}>
              {
                trainerExperienceType(
                  selectedTrainer?.[0]?.trainer_experience_type_id
                )?.trainer_experience_type_name
              }
            </p>
          </div>
          <div className={styles["profile-info"]}>
            <FaLocationDot className={styles.icon} />
            <p className={styles["info-text"]}>
              {location(selectedTrainer?.[0]?.location_id)?.location_name}
            </p>
          </div>
          <div className={styles["profile-info"]}>
            <FaUserFriends className={styles.icon} />
            <p className={styles["info-text"]}>
              {
                trainerEmploymentType(
                  selectedTrainer?.[0]?.trainer_employment_type_id
                )?.trainer_employment_type_name
              }
            </p>
          </div>
          <div className={styles["profile-info"]}>
            <PiMoney className={styles.icon} />
            <p
              className={styles["info-text"]}
            >{`${selectedTrainer?.[0]?.price_hour} TL / Saat`}</p>
          </div>
          <div className={styles["club-info"]}>
            <MdSportsTennis className={styles.icon} />
            <p className={styles["info-text"]}>
              {selectedTrainer?.[0]?.trainer_employment_type_id !== 1 &&
              clubStaff
                ? club(clubStaff?.[0]?.club_id)?.club_name
                : "Bağımsız"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreTrainersProfileSection;
