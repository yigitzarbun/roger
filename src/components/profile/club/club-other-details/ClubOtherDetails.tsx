import React, { useState } from "react";

import styles from "./styles.module.scss";
import DeleteClubModal from "./delete-club-modal/DeleteClubModal";

const ClubOtherDetails = (props) => {
  const { clubDetails } = props;

  const [isDeleteClubModalOpen, setIsDeleteClubModalOpen] = useState(false);

  const handleOpenDeleteClubModal = () => {
    setIsDeleteClubModalOpen(true);
  };

  const handleCloseDeleteClubModal = () => {
    setIsDeleteClubModalOpen(false);
  };
  return (
    <div className={styles["club-payment-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>Hesabı Sil</h4>
        <p>
          Hesabını Raket platformu üzerinden kalıcı olarak sil. Hesap
          silindikten sonra tekrar kurtarılamaz.
        </p>
      </div>
      <div className={styles["delete-container"]}>
        <button onClick={handleOpenDeleteClubModal} className={styles.button}>
          Hesabı Sil
        </button>
      </div>
      <DeleteClubModal
        clubDetails={clubDetails}
        isDeleteClubModalOpen={isDeleteClubModalOpen}
        handleCloseDeleteClubModal={handleCloseDeleteClubModal}
      />
    </div>
  );
};

export default ClubOtherDetails;
