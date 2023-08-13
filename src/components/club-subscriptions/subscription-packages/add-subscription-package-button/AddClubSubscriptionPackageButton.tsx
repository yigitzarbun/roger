import React from "react";

import { FaPlusSquare } from "react-icons/fa";

import styles from "./styles.module.scss";

interface AddClubSubscriptionPackageButtonProps {
  openAddClubSubscriptionPackageModal: () => void;
}

const AddClubSubscriptionPackageButton = (
  props: AddClubSubscriptionPackageButtonProps
) => {
  const { openAddClubSubscriptionPackageModal } = props;
  return (
    <div className={styles["add-subscription-package-container"]}>
      <button
        onClick={openAddClubSubscriptionPackageModal}
        className={styles["add-subscription-package-button"]}
      >
        <FaPlusSquare className={styles["add-icon"]} />
        <h2 className={styles["add-title"]}>Yeni Üyelik Paketi Ekle</h2>
      </button>
    </div>
  );
};

export default AddClubSubscriptionPackageButton;
