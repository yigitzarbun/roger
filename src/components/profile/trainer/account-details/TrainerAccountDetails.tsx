import React, { useState } from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import UpdateTrainerProfileModal from "../../../../components/profile/update-profile-modals/trainer/UpdateTrainerProfileModal";
import PageLoading from "../../../../components/loading/PageLoading";

import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetTrainerEmploymentTypesQuery } from "../../../../api/endpoints/TrainerEmploymentTypesApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetClubStaffQuery } from "../../../../api/endpoints/ClubStaffApi";

const TrainerAccountDetails = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const profileData = {
    trainer_id: user?.trainerDetails.trainer_id,
    fname: user?.trainerDetails.fname,
    lname: user?.trainerDetails.lname,
    birth_year: user?.trainerDetails.birth_year,
    gender: user?.trainerDetails.gender,
    price_hour: user?.trainerDetails.price_hour,
    phone_number: user?.trainerDetails.phone_number,
    image: user?.trainerDetails.image,
    trainer_bio_description: user?.trainerDetails.trainer_bio_description,
    club_id: user?.trainerDetails.club_id,
    trainer_experience_type_id: user?.trainerDetails.trainer_experience_type_id,
    trainer_employment_type_id: user?.trainerDetails.trainer_employment_type_id,
    location_id: user?.trainerDetails.location_id,
    user_id: user?.user.user_id,
  };

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
    isClubStaffLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["trainer-account-details-container"]}>
      <h2>Hesap Bilgileri</h2>
      <button onClick={handleOpenModal}>Düzenle</button>
      <img src={user?.trainerDetails?.image} />
      <p>{`İsim: ${user?.trainerDetails.fname} ${user?.trainerDetails.lname}`}</p>
      <p>{`E-posta: ${user?.user.email}`}</p>
      <p>{`Doğum yılı: ${user?.trainerDetails.birth_year}`}</p>
      <p>{`Cinsiyet: ${user?.trainerDetails.gender}`}</p>
      <p>{`Konum: ${
        locations?.find(
          (location) =>
            location.location_id === Number(user?.trainerDetails.location_id)
        )?.location_name
      }`}</p>
      <p>{`Seviye: ${
        trainerExperienceTypes?.find(
          (type) =>
            type.trainer_experience_type_id ===
            Number(user?.trainerDetails.trainer_experience_type_id)
        )?.trainer_experience_type_name
      }`}</p>
      <p>{`Ders ücreti: ${user?.trainerDetails.price_hour} TL / Saat`}</p>
      <p>{`Çalışma şekli: ${
        trainerEmploymentTypes?.find(
          (type) =>
            type.trainer_employment_type_id ===
            user?.trainerDetails.trainer_employment_type_id
        )?.trainer_employment_type_name
      }`}</p>
      {(user?.trainerDetails.trainer_employment_type_id === 2 ||
        user?.trainerDetails.trainer_employment_type_id === 3) &&
        isTrainerClubsStaff === "accepted" && (
          <p>{`Kulüp: ${
            clubs?.find((club) => club.club_id === user?.trainerDetails.club_id)
              ?.club_name
          }`}</p>
        )}
      {(user?.trainerDetails.trainer_employment_type_id === 2 ||
        user?.trainerDetails.trainer_employment_type_id === 3) &&
        isTrainerClubsStaff === "pending" && (
          <p>{`Kulüp: ${
            clubs?.find((club) => club.club_id === user?.trainerDetails.club_id)
              ?.club_name
          } (onay bekleniyor)`}</p>
        )}
      <UpdateTrainerProfileModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        profileData={profileData}
      />
    </div>
  );
};

export default TrainerAccountDetails;
