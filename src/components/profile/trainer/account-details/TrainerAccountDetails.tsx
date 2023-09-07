import React, { useState } from "react";

import { AiOutlineEdit, AiOutlineMail } from "react-icons/ai";
import { FaGenderless, FaCalendarDays, FaLocationDot } from "react-icons/fa6";
import { CgTennis } from "react-icons/cg";
import { FaUserFriends } from "react-icons/fa";
import { PiMoney } from "react-icons/pi";
import { MdSportsTennis } from "react-icons/md";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import UpdateTrainerProfileModal from "../../../../components/profile/update-profile-modals/trainer/UpdateTrainerProfileModal";
import PageLoading from "../../../../components/loading/PageLoading";

import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetTrainerEmploymentTypesQuery } from "../../../../api/endpoints/TrainerEmploymentTypesApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetClubStaffQuery } from "../../../../api/endpoints/ClubStaffApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";

const TrainerAccountDetails = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const {
    data: trainerEmploymentTypes,
    isLoading: isTrainerEmploymentTypesLoading,
  } = useGetTrainerEmploymentTypesQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: clubStaff, isLoading: isClubStaffLoading } =
    useGetClubStaffQuery({});

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const currentTrainer = trainers?.find(
    (trainer) => trainer.user_id === user?.user?.user_id
  );

  const profileData = {
    trainer_id: currentTrainer?.trainer_id,
    fname: currentTrainer?.fname,
    lname: currentTrainer?.lname,
    birth_year: currentTrainer?.birth_year,
    gender: currentTrainer?.gender,
    price_hour: currentTrainer?.price_hour,
    phone_number: currentTrainer?.phone_number,
    image: currentTrainer?.image,
    trainer_bio_description: currentTrainer?.trainer_bio_description,
    club_id: currentTrainer?.club_id,
    trainer_experience_type_id: currentTrainer?.trainer_experience_type_id,
    trainer_employment_type_id: currentTrainer?.trainer_employment_type_id,
    location_id: currentTrainer?.location_id,
    user_id: user?.user.user_id,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const isTrainerClubsStaff = clubStaff?.find(
    (staff) => staff.user_id === user?.user?.user_id
  )?.employment_status;

  if (
    isLocationsLoading ||
    isTrainerEmploymentTypesLoading ||
    isTrainerExperienceTypesLoading ||
    isClubsLoading ||
    isClubStaffLoading ||
    isTrainersLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["trainer-account-details-container"]}>
      <div className={styles["title-container"]}>
        <h2>Profil</h2>
        <AiOutlineEdit
          onClick={handleOpenModal}
          className={styles["edit-button"]}
        />
      </div>
      <div className={styles["profile-data-container"]}>
        <img
          src={
            currentTrainer?.image
              ? currentTrainer?.image
              : "/images/icons/avatar.png"
          }
          alt="trainer-image"
          className={styles["profile-image"]}
        />
        <div className={styles["profile-info-container"]}>
          <h2>{`${user?.trainerDetails.fname} ${user?.trainerDetails.lname}`}</h2>
          <div className={styles["profile-info"]}>
            <AiOutlineMail className={styles.icon} />
            <p>{`${user?.user.email}`}</p>
          </div>
          <div className={styles["profile-info"]}>
            <FaCalendarDays className={styles.icon} />
            <p>{`${currentTrainer?.birth_year}`}</p>
          </div>
          <div className={styles["profile-info"]}>
            <FaGenderless className={styles.icon} />
            <p>{`${currentTrainer?.gender}`}</p>
          </div>
          <div className={styles["profile-info"]}>
            <FaLocationDot className={styles.icon} />
            <p>{`${
              locations?.find(
                (location) =>
                  location.location_id === Number(currentTrainer?.location_id)
              )?.location_name
            }`}</p>
          </div>
          <div className={styles["profile-info"]}>
            <CgTennis className={styles.icon} />
            <p>{`${
              trainerExperienceTypes?.find(
                (type) =>
                  type.trainer_experience_type_id ===
                  Number(user?.trainerDetails.trainer_experience_type_id)
              )?.trainer_experience_type_name
            }`}</p>
          </div>
          <div className={styles["profile-info"]}>
            <PiMoney className={styles.icon} />
            <p>{`${user?.trainerDetails.price_hour} TL / Saat`}</p>
          </div>
          <div className={styles["profile-info"]}>
            <FaUserFriends className={styles.icon} />
            <p>{`${
              trainerEmploymentTypes?.find(
                (type) =>
                  type.trainer_employment_type_id ===
                  user?.trainerDetails.trainer_employment_type_id
              )?.trainer_employment_type_name
            }`}</p>
          </div>
          <div className={styles["profile-info"]}>
            <MdSportsTennis className={styles.icon} />
            {(currentTrainer?.trainer_employment_type_id === 2 ||
              currentTrainer?.trainer_employment_type_id === 3) &&
            isTrainerClubsStaff === "accepted" ? (
              <p>{`Kulüp: ${
                clubs?.find((club) => club.club_id === currentTrainer?.club_id)
                  ?.club_name
              }`}</p>
            ) : (currentTrainer?.trainer_employment_type_id === 2 ||
                currentTrainer?.trainer_employment_type_id === 3) &&
              isTrainerClubsStaff === "pending" ? (
              <p>{`Kulüp: ${
                clubs?.find((club) => club.club_id === currentTrainer?.club_id)
                  ?.club_name
              } (onay bekleniyor)`}</p>
            ) : (
              <p>Başvurunuz kulüp tarafından kabul edilmedi.</p>
            )}
          </div>
        </div>
      </div>
      <UpdateTrainerProfileModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        profileData={profileData}
      />
    </div>
  );
};

export default TrainerAccountDetails;
