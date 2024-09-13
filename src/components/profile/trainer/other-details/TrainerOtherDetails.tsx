import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import DeleteTrainerModal from "./delete-trainer-modal/DeleteTrainerModal";

const TrainerOtherDetails = (props) => {
  const { trainerDetails } = props;

  const { t } = useTranslation();

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
        <h4>{t("deleteAccountTitle")}</h4>
        <p>{t("deleteAccountText")}</p>
      </div>
      <div className={styles["delete-container"]}>
        <button
          onClick={handleOpenDeleteTrainerModal}
          className={styles.button}
        >
          {t("deleteAccountTitle")}
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
