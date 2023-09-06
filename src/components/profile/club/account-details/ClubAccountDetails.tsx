import React, { useState } from "react";

import { AiOutlineEdit, AiOutlineMail, AiFillInfoCircle } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import { CgTennis } from "react-icons/cg";
import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetClubTypesQuery } from "../../../../api/endpoints/ClubTypesApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";

import UpdateClubProfileModall from "../../../../components/profile/update-profile-modals/club/UpdateClubProfileModal";
import PageLoading from "../../../../components/loading/PageLoading";

const ClubAccountDetails = () => {
  const user = useAppSelector((store) => store.user.user);

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const profileData = clubs?.find(
    (club) => club.user_id === user?.user?.user_id
  );

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: clubTypes, isLoading: isClubTypesLoading } =
    useGetClubTypesQuery({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLocationsLoading || isClubTypesLoading || isClubsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["club-account-details-container"]}>
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
            clubs?.find((club) => club.user_id === user?.user?.user_id)?.image
              ? clubs?.find((club) => club.user_id === user?.user?.user_id)
                  ?.image
              : "/images/icons/avatar.png"
          }
          alt="club-image"
          className={styles["profile-image"]}
        />
        <div className={styles["profile-info-container"]}>
          <h2>{`${user?.clubDetails.club_name}`}</h2>
          <div className={styles["profile-info"]}>
            <AiOutlineMail className={styles.icon} />
            <p>{`${user?.user.email}`}</p>
          </div>
          <div className={styles["profile-info"]}>
            <FaLocationDot className={styles.icon} />
            <p>{`${
              locations?.find(
                (location) =>
                  location.location_id === Number(user?.clubDetails.location_id)
              )?.location_name
            }`}</p>
          </div>
          <div className={styles["profile-info"]}>
            <FaLocationDot className={styles.icon} />
            <p>{`${
              user?.clubDetails.club_address
                ? user?.clubDetails.club_address
                : "Adres belirtilmedi"
            }`}</p>
          </div>
          <div className={styles["profile-info"]}>
            <CgTennis className={styles.icon} />
            <p>{`${
              clubTypes?.find(
                (type) =>
                  type.club_type_id === Number(user?.clubDetails.club_type_id)
              )?.club_type_name
            }`}</p>
          </div>
          <div className={styles["profile-info"]}>
            <AiFillInfoCircle />
            <p>{`${
              user?.clubDetails.club_bio_description
                ? user?.clubDetails.club_bio_description
                : "Belirtilmedi"
            }`}</p>
          </div>
        </div>
      </div>

      {
        <UpdateClubProfileModall
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          profileData={profileData}
        />
      }
    </div>
  );
};

export default ClubAccountDetails;
