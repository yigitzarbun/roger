import React from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";
import { useGetClubSubscriptionsQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetClubSubscriptionPackagesQuery } from "../../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetClubSubscriptionTypesQuery } from "../../../../api/endpoints/ClubSubscriptionTypesApi";

const PlayerSubscriptionResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const {
    data: subscriptionPackages,
    isLoading: isSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesQuery({});

  const { data: subscriptionTypes, isLoading: isSubscriptionTypesLoading } =
    useGetClubSubscriptionTypesQuery({});

  const mySubscriptions = clubSubscriptions?.filter(
    (subscription) =>
      subscription.player_id === user?.user?.user_id &&
      subscription.is_active === true
  );

  if (
    isClubSubscriptionsLoading ||
    isClubsLoading ||
    isSubscriptionPackagesLoading ||
    isSubscriptionTypesLoading
  ) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      {mySubscriptions?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Kulüp</th>
              <th>Üyelik Türü</th>
              <th>Başlangıç</th>
              <th>Bitiş</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {mySubscriptions?.map((subscription) => (
              <tr key={subscription.club_subscription_id}>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}3/${subscription.club_id}`}
                  >
                    <img
                      src={
                        clubs?.find(
                          (club) => club.user_id === subscription.club_id
                        )?.image
                          ? clubs?.find(
                              (club) => club.user_id === subscription.club_id
                            )?.image
                          : "images/icons/avatar.png"
                      }
                      className={styles["club-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}3/${subscription.club_id}`}
                    className={styles["club-name"]}
                  >
                    {
                      clubs?.find(
                        (club) => club.user_id === subscription.club_id
                      )?.club_name
                    }
                  </Link>
                </td>
                <td>
                  {
                    subscriptionTypes?.find(
                      (subscriptionType) =>
                        subscriptionType.club_subscription_type_id ===
                        subscriptionPackages?.find(
                          (subscriptionPackage) =>
                            subscriptionPackage.club_subscription_package_id ===
                            subscription.club_subscription_package_id
                        )?.club_subscription_type_id
                    )?.club_subscription_type_name
                  }
                </td>
                <td>{subscription.start_date.slice(0, 10)}</td>
                <td>{subscription.end_date.slice(0, 10)}</td>
                <td>
                  {subscription.is_active ? "Üyelik Var" : "Üyelik geçersiz"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Kulüp üyeliği bulunmamaktadır</p>
      )}
    </div>
  );
};
export default PlayerSubscriptionResults;
