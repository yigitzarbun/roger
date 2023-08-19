import React from "react";

import { FaPlusSquare } from "react-icons/fa";

import styles from "./styles.module.scss";
import { useAppSelector } from "../../../../store/hooks";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";

interface AddClubSubscriptionPackageButtonProps {
  openAddClubSubscriptionPackageModal: () => void;
}

const AddClubSubscriptionPackageButton = (
  props: AddClubSubscriptionPackageButtonProps
) => {
  const { openAddClubSubscriptionPackageModal } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const clubBankDetailsExist =
    clubs?.find((club) => club.user_id === user?.user?.user_id)?.iban &&
    clubs?.find((club) => club.user_id === user?.user?.user_id)?.bank_id &&
    clubs?.find((club) => club.user_id === user?.user?.user_id)
      ?.name_on_bank_account;

  if (isClubsLoading) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles["add-subscription-package-container"]}>
      <button
        onClick={openAddClubSubscriptionPackageModal}
        className={styles["add-subscription-package-button"]}
        disabled={!clubBankDetailsExist}
      >
        <FaPlusSquare className={styles["add-icon"]} />
        <h2 className={styles["add-title"]}>
          {clubBankDetailsExist
            ? "Yeni Üyelik Paketi Ekle"
            : "Üyelik Paketi Eklemek İçin Banka Hesap Bilgilerinizi Ekleyin"}
        </h2>
      </button>
    </div>
  );
};

export default AddClubSubscriptionPackageButton;
