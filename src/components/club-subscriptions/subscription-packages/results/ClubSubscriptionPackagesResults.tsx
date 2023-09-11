import React from "react";

import styles from "./styles.module.scss";

import AddSubscriptionPackageModal from "../add-subscription-package-modal/AddSubscriptionPackageModal";
import AddClubSubscriptionPackageButton from "../add-subscription-package-button/AddClubSubscriptionPackageButton";

import { ClubSubscriptionPackage } from "../../../../api/endpoints/ClubSubscriptionPackagesApi";
import { ClubSubscription } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { ClubSubscriptionTypes } from "../../../../api/endpoints/ClubSubscriptionTypesApi";

interface ClubSubscriptionPackagesResultsProps {
  openEditClubSubscriptionPackageModal: (value: number) => void;
  openAddClubSubscriptionPackageModal: () => void;
  closeAddClubSubscriptionPackageModal: () => void;
  openAddPackageModal: boolean;
  myPackages: ClubSubscriptionPackage[];
  mySubscribers: ClubSubscription[];
  subscriptionTypes: ClubSubscriptionTypes[];
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
    mySubscribers,
    subscriptionTypes,
  } = props;

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Üyelikler</h2>
        <AddClubSubscriptionPackageButton
          openAddClubSubscriptionPackageModal={
            openAddClubSubscriptionPackageModal
          }
        />
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
              <tr key={subscriptionPackage.club_subscription_package_id}>
                <td>
                  {
                    subscriptionTypes?.find(
                      (type) =>
                        type.club_subscription_type_id ===
                        subscriptionPackage.club_subscription_type_id
                    )?.club_subscription_type_name
                  }
                </td>
                <td>
                  {
                    subscriptionTypes?.find(
                      (type) =>
                        type.club_subscription_type_id ===
                        subscriptionPackage.club_subscription_type_id
                    )?.club_subscription_duration_months
                  }
                </td>
                <td>{subscriptionPackage.price}</td>
                <td>
                  {
                    mySubscribers?.filter(
                      (subscriber) =>
                        subscriber.club_subscription_package_id ===
                        subscriptionPackage.club_subscription_package_id
                    )?.length
                  }
                </td>
                <td>
                  <button
                    onClick={() =>
                      openEditClubSubscriptionPackageModal(
                        subscriptionPackage.club_subscription_package_id
                      )
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
      />
    </div>
  );
};

export default ClubSubscriptionPackagesResults;
