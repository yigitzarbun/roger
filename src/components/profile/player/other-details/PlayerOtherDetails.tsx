import React, { useState } from "react";

import styles from "./styles.module.scss";
import DeletePlayerModal from "./delete-player-modal/DeletePlayerModal";

const PlayerOtherDetails = (props) => {
  const { playerDetails } = props;

  const [isDeletePlayerModalOpen, setIsDeletePlayerModalOpen] = useState(false);

  const handleOpenDeletePlayerModal = () => {
    setIsDeletePlayerModalOpen(true);
  };

  const handleCloseDeletePlayerModal = () => {
    setIsDeletePlayerModalOpen(false);
  };
  return (
    <div className={styles["player-payment-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>Hesabı Sil</h4>
        <p>
          Hesabını Raket platformu üzerinden kalıcı olarak sil. Hesap
          silindikten sonra tekrar kurtarılamaz.
        </p>
      </div>
      <div className={styles["delete-container"]}>
        <button onClick={handleOpenDeletePlayerModal} className={styles.button}>
          Hesabı Sil
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
