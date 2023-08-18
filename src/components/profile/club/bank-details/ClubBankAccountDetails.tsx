import React, { useState } from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetBanksQuery } from "../../../../api/endpoints/BanksApi";

import AddClubBankDetailsModal from "./add-bank-details/AddClubBankDetailsModal";
import EditClubBankDetailsModal from "./edit-bank-details/EditClubBankDetails";

const ClubBankAccountDetails = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: banks, isLoading: isBanksLoading } = useGetBanksQuery({});

  const selectedClub = clubs?.find(
    (club) => club.user_id === user?.user?.user_id
  );

  const bankDetails = {
    bank_id: selectedClub?.bank_id,
    iban: selectedClub?.iban,
    name_on_bank_account: selectedClub?.name_on_bank_account,
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

  if (isClubsLoading || isBanksLoading) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles["club-bank-details-container"]}>
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
            Kort kiralamak ve üyelik satışı yapmak için banka hesap
            bilgilerinizi eklemeniz gerekmektedir
          </p>
          <button onClick={handleOpenAddBankModal}>Hesap Bilgileri Ekle</button>
        </div>
      )}
      <AddClubBankDetailsModal
        isModalOpen={isAddBankModalOpen}
        handleCloseModal={handleCloseAddBankModal}
      />
      <EditClubBankDetailsModal
        isModalOpen={isEditBankModalOpen}
        handleCloseModal={handleCloseEditBankModal}
      />
    </div>
  );
};

export default ClubBankAccountDetails;
