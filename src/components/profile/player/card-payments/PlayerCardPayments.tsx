import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosCheckmarkCircle } from "react-icons/io";
import styles from "./styles.module.scss";
import AddPlayerCardDetails from "./add-card-details/AddPlayerCardDetails";

const PlayerCardPayments = (props) => {
  const { playerDetails, refetchPlayerDetails } = props;

  const { t } = useTranslation();

  const cardDetailsExist =
    playerDetails?.name_on_card &&
    playerDetails?.card_number &&
    playerDetails?.cvc &&
    playerDetails?.card_expiry;

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
        <h4>{t("cardInformation")}</h4>
        <p>{t("cardInformationText")}</p>
      </div>
      <div className={styles.section}>
        {cardDetailsExist ? (
          <div className={styles.section}>
            <div className={styles["card-exists-container"]}>
              <IoIosCheckmarkCircle className={styles.done} />
              <p className={styles["card-exists-text"]}>
                {`${(playerDetails?.card_number).slice(
                  (playerDetails?.card_number).length - 4
                )}
            ${t("cardIsActive")}`}
              </p>
            </div>
            <button onClick={handleOpenAddCardModal} className={styles.button}>
              {t("updateCardInformation")}
            </button>
          </div>
        ) : (
          <div className={styles.section}>
            <h4>{t("noCardInformation")}</h4>
            <button onClick={handleOpenAddCardModal} className={styles.button}>
              {t("addCard")}
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
