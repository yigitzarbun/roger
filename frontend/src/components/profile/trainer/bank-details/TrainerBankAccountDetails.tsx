import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosCheckmarkCircle } from "react-icons/io";
import styles from "./styles.module.scss";
import { useGetBanksQuery } from "../../../../../api/endpoints/BanksApi";
import EditTrainerBankDetailsModal from "./edit-bank-details/EditTrainerBankDetails";

const TrainerBankAccountDetails = (props) => {
  const { trainerDetails, refetchTrainerDetails } = props;

  const { t } = useTranslation();

  const { data: banks, isLoading: isBanksLoading } = useGetBanksQuery({});

  const bankDetailsExist =
    trainerDetails?.trainerIban &&
    trainerDetails?.trainerBankId &&
    trainerDetails?.trainerBankAccountName;

  const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);

  const handleOpenEditBankModal = () => {
    setIsEditBankModalOpen(true);
  };

  const handleCloseEditBankModal = () => {
    setIsEditBankModalOpen(false);
  };

  return (
    <div className={styles["trainer-bank-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>{t("paymentDetailsTitle")}</h4>
        <p>{t("paymentDetailsText")}</p>
      </div>
      <div className={styles.section}>
        {bankDetailsExist ? (
          <>
            <div className={styles["card-exists-container"]}>
              <IoIosCheckmarkCircle className={styles.done} />
              <p>
                {
                  banks?.find(
                    (bank) => bank.bank_id === trainerDetails?.trainerBankId
                  )?.bank_name
                }
              </p>
              <p>
                {trainerDetails?.trainerBankAccountName}{" "}
                {t("bankAccountActiveText")}
              </p>
            </div>
            <button className={styles.button} onClick={handleOpenEditBankModal}>
              {t("edit")}
            </button>
          </>
        ) : (
          <div className={styles.section}>
            <h4>{t("noBankAccount")}</h4>
            <button className={styles.button} onClick={handleOpenEditBankModal}>
              {t("addBankAccount")}
            </button>
          </div>
        )}
      </div>

      {isEditBankModalOpen && (
        <EditTrainerBankDetailsModal
          isModalOpen={isEditBankModalOpen}
          handleCloseModal={handleCloseEditBankModal}
          banks={banks}
          trainerDetails={trainerDetails}
          bankDetailsExist={bankDetailsExist}
          refetchTrainerDetails={refetchTrainerDetails}
        />
      )}
    </div>
  );
};

export default TrainerBankAccountDetails;
