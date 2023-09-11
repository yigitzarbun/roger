import React from "react";

import { FaPlusSquare } from "react-icons/fa";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";
import { useGetClubByClubIdQuery } from "../../../../api/endpoints/ClubsApi";

interface AddClubSubscriptionPackageButtonProps {
  openAddClubSubscriptionPackageModal: () => void;
}

const AddClubSubscriptionPackageButton = (
  props: AddClubSubscriptionPackageButtonProps
) => {
  const { openAddClubSubscriptionPackageModal } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const { data: selectedClub, isLoading: isSelectedClubLoading } =
    useGetClubByClubIdQuery(user?.clubDetails?.club_id);

  const clubBankDetailsExist =
    selectedClub?.[0]?.iban &&
    selectedClub?.[0]?.bank_id &&
    selectedClub?.[0]?.name_on_bank_account;

  if (isSelectedClubLoading) {
    return <PageLoading />;
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
