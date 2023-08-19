import React, { useState } from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetBanksQuery } from "../../../../api/endpoints/BanksApi";
import AddTrainerBankDetailsModal from "./add-bank-details/AddTrainerBankDetails";
import EditTrainerBankDetailsModal from "./edit-bank-details/EditTrainerBankDetails";

const TrainerBankAccountDetails = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const { data: banks, isLoading: isBanksLoading } = useGetBanksQuery({});

  const selectedTrainer = trainers?.find(
    (trainer) => trainer.user_id === user?.user?.user_id
  );

  const bankDetails = {
    bank_id: selectedTrainer?.bank_id,
    iban: selectedTrainer?.iban,
    name_on_bank_account: selectedTrainer?.name_on_bank_account,
  };

  const bankDetailsExist =
    bankDetails?.iban &&
    bankDetails?.bank_id &&
    bankDetails?.name_on_bank_account;

  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);

  const handleOpenAddBankModal = () => {
    setIsAddBankModalOpen(true);
  };

  const handleCloseAddBankModal = () => {
    setIsAddBankModalOpen(false);
  };

  const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);

  const handleOpenEditBankModal = () => {
    setIsEditBankModalOpen(true);
  };

  const handleCloseEditBankModal = () => {
    setIsEditBankModalOpen(false);
  };

  if (isTrainersLoading || isBanksLoading) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles["trainer-bank-details-container"]}>
      <h2>Hesap ve Ödeme Bilgileri</h2>
      {bankDetailsExist ? (
        <>
          <p>{`Banka Adı: ${
            banks?.find((bank) => bank.bank_id === bankDetails?.bank_id)
              ?.bank_name
          }`}</p>
          <p>{`Hesap / IBAN no: ${bankDetails?.iban}`}</p>
          <p>{`Hesap adı: ${bankDetails?.name_on_bank_account}`}</p>
          <button onClick={handleOpenEditBankModal}>
            Hesap Bilgilerini Düzenle
          </button>
        </>
      ) : (
        <div>
          <h3>Kayıtlı banka hesabınız bulunmamaktadır</h3>
          <p>
            Kort kiralamak ve ders satışı yapmak için banka hesap bilgilerinizi
            eklemeniz gerekmektedir
          </p>
          <button onClick={handleOpenAddBankModal}>Hesap Bilgileri Ekle</button>
        </div>
      )}
      <AddTrainerBankDetailsModal
        isModalOpen={isAddBankModalOpen}
        handleCloseModal={handleCloseAddBankModal}
      />
      <EditTrainerBankDetailsModal
        isModalOpen={isEditBankModalOpen}
        handleCloseModal={handleCloseEditBankModal}
      />
    </div>
  );
};

export default TrainerBankAccountDetails;
