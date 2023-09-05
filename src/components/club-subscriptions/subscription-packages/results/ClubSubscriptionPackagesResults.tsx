import React, { useState } from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import AddSubscriptionPackageModal from "../add-subscription-package-modal/AddSubscriptionPackageModal";
import PageLoading from "../../../../components/loading/PageLoading";
import AddClubSubscriptionPackageButton from "../add-subscription-package-button/AddClubSubscriptionPackageButton";

import { useGetClubSubscriptionsQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetClubSubscriptionPackagesQuery } from "../../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetClubSubscriptionTypesQuery } from "../../../../api/endpoints/ClubSubscriptionTypesApi";

interface ClubSubscriptionPackagesResultsProps {
  openEditClubSubscriptionPackageModal: (value: number) => void;
}
const ClubSubscriptionPackagesResults = (
  props: ClubSubscriptionPackagesResultsProps
) => {
  const { openEditClubSubscriptionPackageModal } = props;
  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: clubSubscriptionTypes,
    isLoading: isClubSubscriptionTypesLoading,
  } = useGetClubSubscriptionTypesQuery({});

  const {
    data: clubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
    isError,
  } = useGetClubSubscriptionPackagesQuery({});

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});

  const clubSubscribers = clubSubscriptions?.filter(
    (subscriber) =>
      subscriber.is_active === true &&
      subscriber.club_id === user?.user?.user_id
  );

  const myPackages = clubSubscriptionPackages?.filter(
    (subscriptionPackage) =>
      subscriptionPackage.club_id === user?.user?.user_id &&
      subscriptionPackage.is_active === true
  );

  const [openAddPackageModal, setOpenAddPackageModal] = useState(false);

  const openAddClubSubscriptionPackageModal = () => {
    setOpenAddPackageModal(true);
  };
  const closeAddClubSubscriptionPackageModal = () => {
    setOpenAddPackageModal(false);
  };

  if (isClubSubscriptionTypesLoading || isClubSubscriptionPackagesLoading) {
    return <PageLoading />;
  }

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
      {isClubSubscriptionPackagesLoading ||
        (isClubSubscriptionTypesLoading && <p>Yükleniyor...</p>)}
      {isError && <p>Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>}
      {clubSubscriptionPackages && myPackages.length === 0 && (
        <p>Henüz sisteme eklenmiş üyelik paketiniz bulunmamaktadır.</p>
      )}
      {clubSubscriptionPackages &&
        clubSubscriptionTypes &&
        myPackages.length > 0 && (
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
                      clubSubscriptionTypes?.find(
                        (type) =>
                          type.club_subscription_type_id ===
                          subscriptionPackage.club_subscription_type_id
                      )?.club_subscription_type_name
                    }
                  </td>
                  <td>
                    {
                      clubSubscriptionTypes?.find(
                        (type) =>
                          type.club_subscription_type_id ===
                          subscriptionPackage.club_subscription_type_id
                      )?.club_subscription_duration_months
                    }
                  </td>
                  <td>{subscriptionPackage.price}</td>
                  <td>
                    {
                      clubSubscribers?.filter(
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
      />
    </div>
  );
};

export default ClubSubscriptionPackagesResults;
