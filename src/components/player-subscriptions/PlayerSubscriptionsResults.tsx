import React from "react";

import { Link } from "react-router-dom";
import { SlOptions } from "react-icons/sl";

import paths from "../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../components/loading/PageLoading";

import { useAppSelector } from "../../store/hooks";
import { useGetPlayerActiveClubSubscriptionsQuery } from "../../api/endpoints/ClubSubscriptionsApi";

const PlayerSubscriptionResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetPlayerActiveClubSubscriptionsQuery(user?.user?.user_id);

  if (isClubSubscriptionsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <h2 className={styles.title}>Kulüp Üyelikleri</h2>
      </div>
      {clubSubscriptions?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Kulüp</th>
              <th>Kulüp Adı</th>
              <th>Konum</th>
              <th>Üyelik Türü</th>
              <th>Başlangıç</th>
              <th>Bitiş</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {clubSubscriptions?.map((subscription) => (
              <tr
                key={subscription.club_subscription_id}
                className={styles["club-row"]}
              >
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}3/${subscription.clubUserId}`}
                  >
                    <img
                      src={
                        subscription?.clubImage
                          ? subscription?.clubImage
                          : "images/icons/avatar.jpg"
                      }
                      className={styles["club-image"]}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${paths.EXPLORE_PROFILE}3/${subscription.clubUserId}`}
                    className={styles["club-name"]}
                  >
                    {subscription?.club_name}
                  </Link>
                </td>
                <td>{subscription?.location_name}</td>
                <td>{subscription?.club_subscription_type_name}</td>
                <td>{subscription.start_date.slice(0, 10)}</td>
                <td>{subscription.end_date.slice(0, 10)}</td>
                <td
                  className={
                    subscription.is_active ? styles.active : styles.inactive
                  }
                >
                  {subscription.is_active && "Üyelik Var"}
                  {!subscription.is_active && "Üyelik Geçersiz"}
                </td>
                <td>
                  <SlOptions className={styles.icon} />
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
