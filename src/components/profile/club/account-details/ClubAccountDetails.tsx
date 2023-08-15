import React, { useState } from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetClubTypesQuery } from "../../../../api/endpoints/ClubTypesApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";

import UpdateClubProfileModall from "../../../../components/profile/update-profile-modals/club/UpdateClubProfileModal";

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
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles["club-account-details-container"]}>
      <h2>Hesap Bilgileri</h2>
      <button onClick={handleOpenModal}>Düzenle</button>
      <p>{`Kulüp Adı: ${user?.clubDetails.club_name}`}</p>
      <p>{`E-posta: ${user?.user.email}`}</p>
      <p>{`Açıklama: ${
        user?.clubDetails.club_bio_description
          ? user?.clubDetails.club_bio_description
          : "Belirtilmedi"
      }`}</p>
      <p>{`Konum: ${
        locations?.find(
          (location) =>
            location.location_id === Number(user?.clubDetails.location_id)
        )?.location_name
      }`}</p>
      <p>{`Adres: ${
        user?.clubDetails.club_address
          ? user?.clubDetails.club_address
          : "Adres belirtilmedi"
      }`}</p>
      <p>{`Kulüp Türü: ${
        clubTypes?.find(
          (type) => type.club_type_id === Number(user?.clubDetails.club_type_id)
        )?.club_type_name
      }`}</p>
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
