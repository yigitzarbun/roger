import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import DeleteClubModal from "./delete-club-modal/DeleteClubModal";

const ClubOtherDetails = (props) => {
  const { clubDetails } = props;

  const { t } = useTranslation();

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
        <h4>{t("deleteAccountTitle")}</h4>
        <p>{t("deleteAccountText")}</p>
      </div>
      <div className={styles["delete-container"]}>
        <button onClick={handleOpenDeleteClubModal} className={styles.button}>
          {t("deleteAccountTitle")}
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
