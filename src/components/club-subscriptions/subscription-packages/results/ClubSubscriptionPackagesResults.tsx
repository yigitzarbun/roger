import React from "react";

import styles from "./styles.module.scss";

import AddSubscriptionPackageModal from "../add-subscription-package-modal/AddSubscriptionPackageModal";

import { ClubSubscription } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { ClubSubscriptionTypes } from "../../../../api/endpoints/ClubSubscriptionTypesApi";

interface ClubSubscriptionPackagesResultsProps {
  openEditClubSubscriptionPackageModal: (subscriptionPackage: any) => void;
  openAddClubSubscriptionPackageModal: () => void;
  closeAddClubSubscriptionPackageModal: () => void;
  openAddPackageModal: boolean;
  myPackages: any;
  mySubscribers: ClubSubscription[];
  subscriptionTypes: ClubSubscriptionTypes[];
  selectedClub: any;
  user: any;
}
const ClubSubscriptionPackagesResults = (
  props: ClubSubscriptionPackagesResultsProps
) => {
  const {
    openEditClubSubscriptionPackageModal,
    openAddClubSubscriptionPackageModal,
    closeAddClubSubscriptionPackageModal,
    openAddPackageModal,
    myPackages,
    subscriptionTypes,
    selectedClub,
    user,
  } = props;

  const clubBankDetailsExist =
    selectedClub?.[0]?.iban &&
    selectedClub?.[0]?.bank_id &&
    selectedClub?.[0]?.name_on_bank_account;

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>Üyelikler</h2>
          <button
            onClick={openAddClubSubscriptionPackageModal}
            className={styles["add-subscription-package-button"]}
            disabled={!clubBankDetailsExist}
          >
            <p className={styles["add-title"]}>
              {clubBankDetailsExist
                ? "Üyelik Paketi Ekle"
                : "Üyelik Paketi Eklemek İçin Banka Hesap Bilgilerinizi Ekleyin"}
            </p>
          </button>
        </div>
      </div>

      {myPackages?.length === 0 && (
        <p>Henüz sisteme eklenmiş üyelik paketiniz bulunmamaktadır.</p>
      )}
      {subscriptionTypes && myPackages?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Paket Adı</th>
              <th>Üyelik Süresi (Ay)</th>
              <th>Fiyat (TL)</th>
              <th>Üye Sayısı</th>
            </tr>
          </thead>
          <tbody>
            {myPackages.map((subscriptionPackage) => (
              <tr
                key={subscriptionPackage.club_subscription_package_id}
                className={styles.row}
              >
                <td>{subscriptionPackage?.club_subscription_type_name}</td>
                <td>
                  {subscriptionPackage?.club_subscription_duration_months}
                </td>
                <td>{subscriptionPackage.price}</td>
                <td>{subscriptionPackage?.subscribercount}</td>
                <td>
                  <button
                    onClick={() =>
                      openEditClubSubscriptionPackageModal(subscriptionPackage)
                    }
                    className={styles["edit-package-button"]}
                  >
                    Düzenle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <AddSubscriptionPackageModal
        openAddPackageModal={openAddPackageModal}
        closeAddClubSubscriptionPackageModal={
          closeAddClubSubscriptionPackageModal
        }
        clubSubscriptionTypes={subscriptionTypes}
        myPackages={myPackages}
        user={user}
        selectedClub={selectedClub}
      />
    </div>
  );
};

export default ClubSubscriptionPackagesResults;
