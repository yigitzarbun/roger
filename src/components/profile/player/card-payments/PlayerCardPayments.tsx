import React, { useState } from "react";

import { IoIosCheckmarkCircle } from "react-icons/io";

import styles from "./styles.module.scss";

import AddPlayerCardDetails from "./add-card-details/AddPlayerCardDetails";

const PlayerCardPayments = (props) => {
  const { playerDetails, refetchPlayerDetails } = props;

  const cardDetailsExist =
    playerDetails?.[0]?.name_on_card &&
    playerDetails?.[0]?.card_number &&
    playerDetails?.[0]?.cvc &&
    playerDetails?.[0]?.card_expiry;

  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

  const handleOpenAddCardModal = () => {
    setIsAddCardModalOpen(true);
  };

  const handleCloseAddCardModal = () => {
    setIsAddCardModalOpen(false);
  };

  return (
    <div className={styles["player-payment-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>Kart Bilgileri</h4>
        <p>
          Antreman, maç ve özel ders etkinlikleri ile kulüp üyeliği işlemleri
          için kart bilgisi eklemek zorunludur.
        </p>
      </div>

      <div className={styles.section}>
        {cardDetailsExist ? (
          <div className={styles.section}>
            <div className={styles["card-exists-container"]}>
              <IoIosCheckmarkCircle className={styles.done} />
              <p className={styles["card-exists-text"]}>
                {`${(playerDetails?.[0]?.card_number).slice(
                  (playerDetails?.[0]?.card_number).length - 4
                )}
            ile biten kartınız aktiftir`}
              </p>
            </div>
            <button onClick={handleOpenAddCardModal} className={styles.button}>
              Kart Bilgilerini Düzenle
            </button>
          </div>
        ) : (
          <div className={styles.section}>
            <h4>Kayıtlı kart bulunmamaktadır</h4>
            <button onClick={handleOpenAddCardModal} className={styles.button}>
              Kart Ekle
            </button>
          </div>
        )}
      </div>
      {isAddCardModalOpen && (
        <AddPlayerCardDetails
          isModalOpen={isAddCardModalOpen}
          handleCloseModal={handleCloseAddCardModal}
          playerDetails={playerDetails}
          refetchPlayerDetails={refetchPlayerDetails}
          cardDetailsExist={cardDetailsExist}
        />
      )}
    </div>
  );
};

export default PlayerCardPayments;
