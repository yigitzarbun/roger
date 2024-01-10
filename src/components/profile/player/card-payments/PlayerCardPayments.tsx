import React, { useState } from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import AddPlayerCardDetails from "./add-card-details/AddPlayerCardDetails";
import EditPlayerCardDetails from "./edit-card-details/EditPlayerCardDetails";
import PageLoading from "../../../../components/loading/PageLoading";

import { useGetPlayerByUserIdQuery } from "../../../../api/endpoints/PlayersApi";

const PlayerCardPayments = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: selectedPlayer, isLoading: isSelectedPlayerLoading } =
    useGetPlayerByUserIdQuery(user?.user?.user_id);

  const cardDetailsExist =
    selectedPlayer?.[0]?.name_on_card &&
    selectedPlayer?.[0]?.card_number &&
    selectedPlayer?.[0]?.cvc &&
    selectedPlayer?.[0]?.card_expiry;

  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

  const handleOpenAddCardModal = () => {
    setIsAddCardModalOpen(true);
  };

  const handleCloseAddCardModal = () => {
    setIsAddCardModalOpen(false);
  };

  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);

  const handleOpenEditCardModal = () => {
    setIsEditCardModalOpen(true);
  };

  const handleCloseEditCardModal = () => {
    setIsEditCardModalOpen(false);
  };

  if (isSelectedPlayerLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["player-payment-details-container"]}>
      <h2>Kart ve Ödeme</h2>

      <div className={styles.section}>
        {cardDetailsExist ? (
          <div className={styles.section}>
            <p className={styles["card-exists-text"]}>
              {`${(selectedPlayer?.[0]?.card_number).slice(
                (selectedPlayer?.[0]?.card_number).length - 4
              )}
            ile biten kartınız aktiftir`}
            </p>
            <button
              onClick={handleOpenEditCardModal}
              className={styles["view-all-button"]}
            >
              Kart Bilgilerini Düzenle
            </button>
          </div>
        ) : (
          <div className={styles.section}>
            <h4>Kayıtlı kart bulunmamaktadır</h4>
            <p className={styles["card-missing-text"]}>
              Antreman, maç ve özel ders etkinlikleri ile kulüp üyeliği
              işlemleri için kart bilgisi eklemek zorunludur.
            </p>
            <button
              onClick={handleOpenAddCardModal}
              className={styles["view-all-button"]}
            >
              Yeni Kart Ekle
            </button>
          </div>
        )}
      </div>

      <AddPlayerCardDetails
        isModalOpen={isAddCardModalOpen}
        handleCloseModal={handleCloseAddCardModal}
      />
      <EditPlayerCardDetails
        isModalOpen={isEditCardModalOpen}
        handleCloseModal={handleCloseEditCardModal}
      />
    </div>
  );
};

export default PlayerCardPayments;
