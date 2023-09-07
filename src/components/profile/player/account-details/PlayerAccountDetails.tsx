import React, { useState } from "react";

import { AiOutlineEdit, AiOutlineMail } from "react-icons/ai";
import { FaGenderless, FaCalendarDays, FaLocationDot } from "react-icons/fa6";
import { CgTennis } from "react-icons/cg";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";
import UpdateProfileModal from "../../update-profile-modals/player/UpdatePlayerProfileModal";

import { useAppSelector } from "../../../../store/hooks";
import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";

const PlayerAccountDetails = () => {
  const user = useAppSelector((store) => store.user.user);

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const currentPlayer = players?.find(
    (player) => player.user_id === user?.user?.user_id
  );

  const profileData = {
    player_id: currentPlayer?.player_id,
    fname: currentPlayer?.fname,
    lname: currentPlayer?.lname,
    birth_year: currentPlayer?.birth_year,
    gender: currentPlayer?.gender,
    phone_number: currentPlayer?.phone_number,
    image: currentPlayer?.image,
    player_bio_description: currentPlayer?.player_bio_description,
    location_id: currentPlayer?.location_id,
    player_level_id: currentPlayer?.player_level_id,
    user_id: user?.user.user_id,
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLocationsLoading || isPlayerLevelsLoading || isPlayersLoading) {
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
          src={
            currentPlayer?.image
              ? currentPlayer?.image
              : "/images/icons/avatar.png"
          }
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
            <p className={styles["info-text"]}>{currentPlayer?.birth_year}</p>
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
