import React, { useState } from "react";

import { IoIosCheckmarkCircle } from "react-icons/io";

import styles from "./styles.module.scss";
import { useGetBanksQuery } from "../../../../api/endpoints/BanksApi";
import EditTrainerBankDetailsModal from "./edit-bank-details/EditTrainerBankDetails";

const TrainerBankAccountDetails = (props) => {
  const { trainerDetails, refetchTrainerDetails } = props;
  const { data: banks, isLoading: isBanksLoading } = useGetBanksQuery({});

  const bankDetailsExist =
    trainerDetails?.iban &&
    trainerDetails?.bank_id &&
    trainerDetails?.name_on_bank_account;

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
        <h4>Kart Bilgileri</h4>
        <p>Ders verebilmek için banka bilgisi eklemek zorunludur.</p>
      </div>
      <div className={styles.section}>
        {bankDetailsExist ? (
          <>
            <div className={styles["card-exists-container"]}>
              <IoIosCheckmarkCircle className={styles.done} />
              <p>
                {
                  banks?.find(
                    (bank) => bank.bank_id === trainerDetails?.bank_id
                  )?.bank_name
                }
              </p>
              <p>
                {trainerDetails?.name_on_bank_account} isimli hesabınız aktiftir
              </p>
            </div>
            <button className={styles.button} onClick={handleOpenEditBankModal}>
              Düzenle
            </button>
          </>
        ) : (
          <div className={styles.section}>
            <h4>Kayıtlı banka hesabınız bulunmamaktadır</h4>
            <button className={styles.button} onClick={handleOpenEditBankModal}>
              Hesap Bilgileri Ekle
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
