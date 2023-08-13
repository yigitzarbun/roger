import React from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import { useGetClubSubscriptionPackagesQuery } from "../../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetClubSubscriptionTypesQuery } from "../../../../api/endpoints/ClubSubscriptionTypesApi";

const ClubSubscriptionPackagesResults = () => {
  const { user } = useAppSelector((store) => store.user);

  const {
    data: clubSubscriptionTypes,
    isLoading: isClubSubscriptionTypesLoading,
  } = useGetClubSubscriptionTypesQuery({});

  const {
    data: clubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
    isError,
  } = useGetClubSubscriptionPackagesQuery({});

  const myPackages = clubSubscriptionPackages?.filter(
    (subscriptionPackage) => subscriptionPackage.club_id === user?.user?.user_id
  );

  if (isClubSubscriptionTypesLoading || isClubSubscriptionPackagesLoading) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Kortlar</h2>
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
              </tr>
            </thead>
            <tbody>
              {myPackages.map((subscriptionPackage) => (
                <tr
                  key={subscriptionPackage.club_subscription_package_id}
                  className={styles["court-row"]}
                >
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
                  <td>Düzenle</td>
                  <td>Sil</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
};

export default ClubSubscriptionPackagesResults;
