import React, { useEffect, useState } from "react";

import styles from "./styles.module.scss";

import AddSubscriptionPackageModal from "../add-subscription-package-modal/AddSubscriptionPackageModal";

import { ClubSubscription } from "../../../../../api/endpoints/ClubSubscriptionsApi";
import { ClubSubscriptionTypes } from "../../../../../api/endpoints/ClubSubscriptionTypesApi";
import EditClubBankDetailsModal from "../../../../components/profile/club/bank-details/edit-bank-details/EditClubBankDetails";
import { useGetBanksQuery } from "../../../../../api/endpoints/BanksApi";

interface ClubSubscriptionPackagesResultsProps {
  openEditClubSubscriptionPackageModal: (subscriptionPackage: any) => void;
  openAddClubSubscriptionPackageModal: () => void;
  closeAddClubSubscriptionPackageModal: () => void;
  openAddPackageModal: boolean;
  myPackages: any;
  subscriptionTypes: ClubSubscriptionTypes[];
  currentClub: any;
  user: any;
  refetchClubDetails: () => void;
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
    currentClub,
    user,
    refetchClubDetails,
  } = props;

  const { data: banks, isLoading: isBanksLoading } = useGetBanksQuery({});

  const bankDetailsExist =
    currentClub?.[0]?.iban &&
    currentClub?.[0]?.bank_id &&
    currentClub?.[0]?.name_on_bank_account;

  const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);

  const handleOpenEditBankModal = () => {
    setIsEditBankModalOpen(true);
  };

  const handleCloseEditBankModal = () => {
    setIsEditBankModalOpen(false);
  };

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>Üyelikler</h2>
          {bankDetailsExist && (
            <button
              onClick={openAddClubSubscriptionPackageModal}
              className={styles["add-subscription-package-button"]}
              disabled={!bankDetailsExist}
            >
              <p className={styles["add-title"]}>Üyelik Paketi Ekle</p>
            </button>
          )}
        </div>
      </div>

      {!bankDetailsExist ? (
        <div className={styles["add-bank-details-container"]}>
          <p>Üyelik satışı yapmak için banka bilgilerinizi ekleyin.</p>
          <button className={styles.button} onClick={handleOpenEditBankModal}>
            Banka Bilgilerini Ekle
          </button>
        </div>
      ) : (
        bankDetailsExist &&
        myPackages?.length === 0 && (
          <p>Henüz sisteme eklenmiş üyelik paketiniz bulunmamaktadır.</p>
        )
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
      {openAddPackageModal && (
        <AddSubscriptionPackageModal
          openAddPackageModal={openAddPackageModal}
          closeAddClubSubscriptionPackageModal={
            closeAddClubSubscriptionPackageModal
          }
          clubSubscriptionTypes={subscriptionTypes}
          myPackages={myPackages}
          user={user}
          currentClub={currentClub}
        />
      )}
      {isEditBankModalOpen && (
        <EditClubBankDetailsModal
          isModalOpen={isEditBankModalOpen}
          handleCloseModal={handleCloseEditBankModal}
          banks={banks}
          clubDetails={currentClub}
          bankDetailsExist={bankDetailsExist}
          refetchClubDetails={refetchClubDetails}
        />
      )}
    </div>
  );
};

export default ClubSubscriptionPackagesResults;
