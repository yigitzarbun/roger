import React from "react";

import { Link } from "react-router-dom";

import { useAppSelector } from "../../../store/hooks";

import paths from "../../../routing/Paths";

import { useGetClubSubscriptionsQuery } from "../../../api/endpoints/ClubSubscriptionsApi";
import { useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";
import { useGetClubSubscriptionTypesQuery } from "../../../api/endpoints/ClubSubscriptionTypesApi";
import { useGetClubSubscriptionPackagesQuery } from "../../../api/endpoints/ClubSubscriptionPackagesApi";

import styles from "./styles.module.scss";

const ClubSubscribersResults = () => {
  const user = useAppSelector((store) => store?.user?.user?.user);

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});

  const {
    data: clubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { data: subscriptionTypes, isLoading: isSubscriptionTypesLoading } =
    useGetClubSubscriptionTypesQuery({});

  const mySubscriptions = clubSubscriptions?.filter(
    (subscription) =>
      subscription.club_id === user?.user_id && subscription.is_active === true
  );

  const today = new Date();
  const year = today.getFullYear();

  if (
    isClubSubscriptionsLoading ||
    isPlayersLoading ||
    isLocationsLoading ||
    isPlayerLevelsLoading ||
    isSubscriptionTypesLoading ||
    isClubSubscriptionPackagesLoading
  ) {
    return <div>Yükleniyor</div>;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Üyeler</h2>
      </div>
      {(isPlayersLoading || isClubSubscriptionsLoading) && <p>Yükleniyor...</p>}
      {players && clubSubscriptions && mySubscriptions.length === 0 && (
        <p>Kayıtlı aktif üye bulunmamaktadır.</p>
      )}
      {players &&
        clubSubscriptions &&
        locations &&
        playerLevels &&
        subscriptionTypes &&
        clubSubscriptionPackages &&
        mySubscriptions.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Oyuncu</th>
                <th>İsim</th>
                <th>Seviye</th>
                <th>Cinsiyet</th>
                <th>Yaş</th>
                <th>Konum</th>
                <th>Üyelik Tipi</th>
                <th>Üyelik Başlangıç</th>
                <th>Üyelik Bitiş</th>
                <th>Üyelik Durumu</th>
              </tr>
            </thead>
            <tbody>
              {mySubscriptions.map((subscription) => (
                <tr
                  key={subscription.club_subscription_id}
                  className={styles["subscription-row"]}
                >
                  <td>
                    <img
                      src={"/images/icons/avatar.png"}
                      alt="subsciption"
                      className={styles["subscription-image"]}
                    />
                  </td>
                  <td>
                    {` ${
                      players?.find(
                        (player) => player.user_id === subscription.player_id
                      )?.fname
                    } ${
                      players?.find(
                        (player) => player.user_id === subscription.player_id
                      )?.lname
                    }`}
                  </td>
                  <td>
                    {
                      playerLevels?.find(
                        (level) =>
                          level.player_level_id ===
                          players?.find(
                            (player) =>
                              player.user_id === subscription.player_id
                          )?.player_level_id
                      )?.player_level_name
                    }
                  </td>
                  <td>
                    {
                      players?.find(
                        (player) => player.user_id === subscription.player_id
                      )?.gender
                    }
                  </td>
                  <td>
                    {year -
                      players?.find(
                        (player) => player.user_id === subscription.player_id
                      )?.birth_year}
                  </td>
                  <td>
                    {
                      locations?.find(
                        (location) =>
                          location.location_id ===
                          players?.find(
                            (player) =>
                              player.user_id === subscription.player_id
                          )?.location_id
                      )?.location_name
                    }
                  </td>
                  <td>
                    {
                      subscriptionTypes?.find(
                        (type) =>
                          type.club_subscription_type_id ===
                          clubSubscriptionPackages?.find(
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
                    {subscription.is_active === true ? "Aktif" : "Sonlandı"}
                  </td>
                  <td>
                    <Link
                      to={`${paths.EXPLORE_PROFILE}1/${subscription.player_id} `}
                    >
                      Görüntüle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
};
export default ClubSubscribersResults;
