import React, { useState } from "react";
import styles from "./styles.module.scss";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useGetBanksQuery } from "../../../../../api/endpoints/BanksApi";
import EditClubBankDetailsModal from "./edit-bank-details/EditClubBankDetails";

interface ClubBankAccountDetailsProps {
  clubDetails: any;
  refetchClubDetails: () => void;
}
const ClubBankAccountDetails = (props: ClubBankAccountDetailsProps) => {
  const { clubDetails, refetchClubDetails } = props;
  const { data: banks, isLoading: isBanksLoading } = useGetBanksQuery({});

  const bankDetails = {
    bank_id: clubDetails?.[0]?.bank_id,
    iban: clubDetails?.[0]?.iban,
    name_on_bank_account: clubDetails?.[0]?.name_on_bank_account,
  };

  const bankDetailsExist =
    bankDetails?.iban &&
    bankDetails?.bank_id &&
    bankDetails?.name_on_bank_account;

  const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);

  const handleOpenEditBankModal = () => {
    setIsEditBankModalOpen(true);
  };

  const handleCloseEditBankModal = () => {
    setIsEditBankModalOpen(false);
  };

  return (
    <div className={styles["club-bank-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>Kart Bilgileri</h4>
        <p>
          Kort kiralama ve kulüp üyeliği satışı işlemleri için banka bilgisi
          eklemek zorunludur.
        </p>
      </div>
      <div className={styles.section}>
        {bankDetailsExist ? (
          <>
            <div className={styles["card-exists-container"]}>
              <IoIosCheckmarkCircle className={styles.done} />
              <p>
                {
                  banks?.find((bank) => bank.bank_id === bankDetails?.bank_id)
                    ?.bank_name
                }
              </p>
              <p>
                {bankDetails?.name_on_bank_account} isimli hesabınız aktiftir
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
        <EditClubBankDetailsModal
          isModalOpen={isEditBankModalOpen}
          handleCloseModal={handleCloseEditBankModal}
          banks={banks}
          clubDetails={clubDetails}
          bankDetailsExist={bankDetailsExist}
          refetchClubDetails={refetchClubDetails}
        />
      )}
    </div>
  );
};

export default ClubBankAccountDetails;
