import React from "react";
import { Link } from "react-router-dom";
import paths from "../../routing/Paths";
import styles from "./styles.module.scss";
import PageLoading from "../../components/loading/PageLoading";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useAppSelector } from "../../store/hooks";
import { useGetPlayerActiveClubSubscriptionsQuery } from "../../../api/endpoints/ClubSubscriptionsApi";
import { useTranslation } from "react-i18next";

const PlayerSubscriptionResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { t } = useTranslation();

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetPlayerActiveClubSubscriptionsQuery(user?.user?.user_id);

  if (isClubSubscriptionsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["title-container"]}>
        <h2 className={styles.title}>{t("clubSubscriptionsTitle")}</h2>
      </div>
      {clubSubscriptions?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{t("tableClubHeader")}</th>
              <th>{t("clubNameHeader")}</th>
              <th>{t("tableLocationHeader")}</th>
              <th>{t("subscriptionTypeHeader")}</th>
              <th>{t("start")}</th>
              <th>{t("end")}</th>
              <th>{t("tableStatusHeader")}</th>
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
                <td>
                  {subscription?.club_subscription_type_id === 1
                    ? t("oneMonthSubscription")
                    : subscription?.club_subscription_type_id === 2
                    ? t("threeMonthSubscription")
                    : subscription?.club_subscription_type_id === 3
                    ? t("sixMonthSubscription")
                    : t("twelveMonthSubscription")}
                </td>
                <td>{subscription.start_date.slice(0, 10)}</td>
                <td>{subscription.end_date.slice(0, 10)}</td>
                <td
                  className={
                    subscription.is_active ? styles.active : styles.inactive
                  }
                >
                  {subscription.is_active && (
                    <IoIosCheckmarkCircle className={styles.done} />
                  )}
                  {!subscription.is_active && "Üyelik Geçersiz"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{t("playerNoSubscriptionsText")}</p>
      )}
    </div>
  );
};
export default PlayerSubscriptionResults;
