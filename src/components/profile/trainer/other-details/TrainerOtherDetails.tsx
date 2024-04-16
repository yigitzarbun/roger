import React, { useState } from "react";

import styles from "./styles.module.scss";
import DeleteTrainerModal from "./delete-trainer-modal/DeleteTrainerModal";

const TrainerOtherDetails = (props) => {
  const { trainerDetails } = props;

  const [isDeleteTrainerModalOpen, setIsDeleteTrainerModalOpen] =
    useState(false);

  const handleOpenDeleteTrainerModal = () => {
    setIsDeleteTrainerModalOpen(true);
  };

  const handleCloseDeleteTrainerModal = () => {
    setIsDeleteTrainerModalOpen(false);
  };
  return (
    <div className={styles["trainer-payment-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>Hesabı Sil</h4>
        <p>
          Hesabını Raket platformu üzerinden kalıcı olarak sil. Hesap
          silindikten sonra tekrar kurtarılamaz.
        </p>
      </div>
      <div className={styles["delete-container"]}>
        <button
          onClick={handleOpenDeleteTrainerModal}
          className={styles.button}
        >
          Hesabı Sil
        </button>
      </div>
      {isDeleteTrainerModalOpen && (
        <DeleteTrainerModal
          trainerDetails={trainerDetails}
          isDeleteTrainerModalOpen={isDeleteTrainerModalOpen}
          handleCloseDeleteTrainerModal={handleCloseDeleteTrainerModal}
        />
      )}
    </div>
  );
};

export default TrainerOtherDetails;
