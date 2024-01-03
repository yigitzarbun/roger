import React from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../store/hooks";
import { useGetPlayerActiveClubSubscriptionsQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";

const PlayerSubscriptionResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetPlayerActiveClubSubscriptionsQuery(user?.user?.user_id);

  if (isClubSubscriptionsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      {clubSubscriptions?.length > 0 ? (
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
            {clubSubscriptions?.map((subscription) => (
              <tr key={subscription.club_subscription_id}>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}3/${subscription.club_id}`}
                  >
                    <img
                      src={
                        subscription?.image
                          ? subscription?.image
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
                    {subscription?.club_name}
                  </Link>
                </td>
                <td>{subscription?.club_subscription_type_name}</td>
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
