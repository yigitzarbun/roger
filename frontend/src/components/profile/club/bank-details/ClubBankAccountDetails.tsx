import React, { useState } from "react";
import styles from "./styles.module.scss";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useGetBanksQuery } from "../../../../../api/endpoints/BanksApi";
import EditClubBankDetailsModal from "./edit-bank-details/EditClubBankDetails";
import PageLoading from "../../../loading/PageLoading";
import { useTranslation } from "react-i18next";

interface ClubBankAccountDetailsProps {
  clubDetails: any;
  refetchClubDetails: () => void;
}
const ClubBankAccountDetails = (props: ClubBankAccountDetailsProps) => {
  const { clubDetails, refetchClubDetails } = props;

  const { t } = useTranslation();

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

  if (isBanksLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["club-bank-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>{t("bankDetails")}</h4>
        <p>{t("clubBankDetailText")}</p>
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
                {`${bankDetails?.name_on_bank_account} ${t(
                  "bankAccountActiveText"
                )}`}
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
