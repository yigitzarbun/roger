import React, { useState } from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";
import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";

import UpdateProfileModal from "../../../../components/profile/update-profile-modal/UpdateProfileModal";

const PlayerAccountDetails = () => {
  const user = useAppSelector((store) => store.user.user);

  const profileData = {
    player_id: user?.playerDetails.player_id,
    fname: user?.playerDetails.fname,
    lname: user?.playerDetails.lname,
    birth_year: user?.playerDetails.birth_year,
    gender: user?.playerDetails.gender,
    phone_number: user?.playerDetails.phone_number,
    image: user?.playerDetails.image,
    player_bio_description: user?.playerDetails.player_bio_description,
    location_id: user?.playerDetails.location_id,
    player_level_id: user?.playerDetails.player_level_id,
    user_id: user?.user.user_id,
  };

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  console.log(typeof user?.playerDetails.player_level_id);
  if (isLocationsLoading || isPlayerLevelsLoading) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles["player-account-details-container"]}>
      <h2>Hesap Bilgileri</h2>
      <button onClick={handleOpenModal}>Düzenle</button>
      <p>{`İsim: ${user?.playerDetails.fname} ${user?.playerDetails.lname}`}</p>
      <p>{`E-posta: ${user?.user.email}`}</p>
      <p>{`Doğum yılı: ${user?.playerDetails.birth_year}`}</p>
      <p>{`Cinsiyet: ${user?.playerDetails.gender}`}</p>
      <p>{`Konum: ${
        locations?.find(
          (location) =>
            location.location_id === Number(user?.playerDetails.location_id)
        )?.location_name
      }`}</p>
      <p>{`Seviye: ${
        playerLevels?.find(
          (level) =>
            level.player_level_id ===
            Number(user?.playerDetails.player_level_id)
        )?.player_level_name
      }`}</p>
      <UpdateProfileModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        profileData={profileData}
      />
    </div>
  );
};

export default PlayerAccountDetails;
