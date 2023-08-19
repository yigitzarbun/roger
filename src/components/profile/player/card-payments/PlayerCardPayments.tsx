import React, { useEffect, useState } from "react";

import styles from "./styles.module.scss";
import { useAppSelector } from "../../../../store/hooks";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import AddPlayerCardDetails from "./add-card-details/AddPlayerCardDetails";
import EditPlayerCardDetails from "./edit-card-details/EditPlayerCardDetails";

const PlayerCardPayments = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: players,
    isLoading: isPlayersLoading,
    refetch,
  } = useGetPlayersQuery({});

  const selectedPlayer = players?.find(
    (player) => player.user_id === user?.user?.user_id
  );
  const cardDetailsExist =
    selectedPlayer?.name_on_card &&
    selectedPlayer?.card_number &&
    selectedPlayer?.cvc &&
    selectedPlayer?.card_expiry;

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

  if (isPlayersLoading) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles["player-payment-details-container"]}>
      <h2>Kart ve Ödeme Bilgileri</h2>
      {cardDetailsExist ? (
        <div>
          <p>
            {`${selectedPlayer?.card_number}
            ile biten kartınız aktiftir`}
          </p>
          <button onClick={handleOpenEditCardModal}>
            Kart Bilgilerini Düzenle
          </button>
        </div>
      ) : (
        <div>
          <h4>Henüz sisteme eklenmiş kart bulunmamaktadır</h4>
          <p>
            Antreman, maç ve özel ders etkinlikleri ile kulüp üyeliği işlemleri
            için kart bilgisi eklemek zorunludur.
          </p>
          <button onClick={handleOpenAddCardModal}>Yeni Kart Ekle</button>
        </div>
      )}
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
