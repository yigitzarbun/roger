import React, { useState } from "react";

import { AiOutlineEdit, AiOutlineMail } from "react-icons/ai";
import { FaGenderless, FaCalendarDays, FaLocationDot } from "react-icons/fa6";
import { CgTennis } from "react-icons/cg";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";
import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";

import UpdateProfileModal from "../../update-profile-modals/player/UpdatePlayerProfileModal";
import PageLoading from "../../../../components/loading/PageLoading";

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

  if (isLocationsLoading || isPlayerLevelsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["player-account-details-container"]}>
      <div className={styles["title-container"]}>
        <h2>Hesap</h2>
        <AiOutlineEdit
          onClick={handleOpenModal}
          className={styles["edit-button"]}
        />
      </div>
      <div className={styles["profile-data-container"]}>
        <img
          src={user?.playerDetails?.image}
          alt="player-image"
          className={styles["profile-image"]}
        />
        <div className={styles["profile-info-container"]}>
          <h2>{`${user?.playerDetails.fname} ${user?.playerDetails.lname}`}</h2>
          <div className={styles["profile-info"]}>
            <AiOutlineMail className={styles.icon} />
            <p>{user?.user.email}</p>
          </div>
          <div className={styles["profile-info"]}>
            <FaCalendarDays className={styles.icon} />
            <p className={styles["info-text"]}>
              {user?.playerDetails.birth_year}
            </p>
          </div>
          <div className={styles["profile-info"]}>
            <FaGenderless className={styles.icon} />
            <p className={styles["info-text"]}>{user?.playerDetails.gender}</p>
          </div>
          <div className={styles["profile-info"]}>
            <FaLocationDot className={styles.icon} />
            <p className={styles["info-text"]}>
              {
                locations?.find(
                  (location) =>
                    location.location_id ===
                    Number(user?.playerDetails.location_id)
                )?.location_name
              }
            </p>
          </div>
          <div className={styles["profile-info"]}>
            <CgTennis className={styles.icon} />
            <p className={styles["info-text"]}>{`Seviye: ${
              playerLevels?.find(
                (level) =>
                  level.player_level_id ===
                  Number(user?.playerDetails.player_level_id)
              )?.player_level_name
            }`}</p>
          </div>
        </div>
      </div>
      <UpdateProfileModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        profileData={profileData}
      />
    </div>
  );
};

export default PlayerAccountDetails;
