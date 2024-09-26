import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import AddSubscriptionPackageModal from "../add-subscription-package-modal/AddSubscriptionPackageModal";
import { ClubSubscriptionTypes } from "../../../../../api/endpoints/ClubSubscriptionTypesApi";
import EditClubBankDetailsModal from "../../../../components/profile/club/bank-details/edit-bank-details/EditClubBankDetails";
import { useGetBanksQuery } from "../../../../../api/endpoints/BanksApi";
import PageLoading from "../../../../components/loading/PageLoading";

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

  const { t } = useTranslation();

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

  if (isBanksLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <div className={styles["title-container"]}>
          <h2 className={styles["result-title"]}>
            {t("subscriptionPackages")}
          </h2>
          {bankDetailsExist && (
            <button
              onClick={openAddClubSubscriptionPackageModal}
              className={styles["add-subscription-package-button"]}
              disabled={!bankDetailsExist}
            >
              <p className={styles["add-title"]}>
                {t("addSubscriptionPackageTitle")}
              </p>
            </button>
          )}
        </div>
      </div>

      {!bankDetailsExist ? (
        <div className={styles["add-bank-details-container"]}>
          <p>{t("addBankDetailsSubscriptionPackage")}</p>
          <button className={styles.button} onClick={handleOpenEditBankModal}>
            {t("addBankAccount")}
          </button>
        </div>
      ) : (
        bankDetailsExist &&
        myPackages?.length === 0 && <p>{t("noSubscriptionPackages")}</p>
      )}
      {subscriptionTypes && myPackages?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>{t("subscriptionPackageName")}</th>
              <th>{t("subscriptionPackageDurationTitle")}</th>
              <th>{t("price")} (TL)</th>
              <th>{t("tableSubscribersHeader")}</th>
            </tr>
          </thead>
          <tbody>
            {myPackages.map((subscriptionPackage) => (
              <tr
                key={subscriptionPackage.club_subscription_package_id}
                className={styles.row}
              >
                <td>
                  {subscriptionPackage?.club_subscription_type_id === 1
                    ? t("oneMonthSubscription")
                    : subscriptionPackage?.club_subscription_type_id === 2
                    ? t("threeMonthSubscription")
                    : subscriptionPackage?.club_subscription_type_id === 3
                    ? t("sixMonthSubscription")
                    : t("twelveMonthSubscription")}
                </td>
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
                    {t("edit")}
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
