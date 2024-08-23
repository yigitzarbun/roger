import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import DeletePlayerModal from "./delete-player-modal/DeletePlayerModal";

const PlayerOtherDetails = (props) => {
  const { playerDetails } = props;

  const [isDeletePlayerModalOpen, setIsDeletePlayerModalOpen] = useState(false);

  const { t } = useTranslation();

  const handleOpenDeletePlayerModal = () => {
    setIsDeletePlayerModalOpen(true);
  };

  const handleCloseDeletePlayerModal = () => {
    setIsDeletePlayerModalOpen(false);
  };
  return (
    <div className={styles["player-payment-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>{t("deleteAccountTitle")}</h4>
        <p>{t("deleteAccountText")}</p>
      </div>
      <div className={styles["delete-container"]}>
        <button onClick={handleOpenDeletePlayerModal} className={styles.button}>
          {t("deleteAccountTitle")}
        </button>
      </div>
      <DeletePlayerModal
        playerDetails={playerDetails}
        isDeletePlayerModalOpen={isDeletePlayerModalOpen}
        handleCloseDeletePlayerModal={handleCloseDeletePlayerModal}
      />
    </div>
  );
};

export default PlayerOtherDetails;
