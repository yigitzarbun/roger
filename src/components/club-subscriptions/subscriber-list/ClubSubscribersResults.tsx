import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { FaPlusSquare } from "react-icons/fa";

import { useAppSelector } from "../../../store/hooks";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import AddClubSubscriberModal from "./add-subscriber-modal/AddClubSubscriberModal";
import EditClubSubscriberModal from "./edit-subscriber-modal/EditClubSubscriberModal";

import { useGetClubSubscriptionsQuery } from "../../../api/endpoints/ClubSubscriptionsApi";
import { useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";
import { useGetClubSubscriptionTypesQuery } from "../../../api/endpoints/ClubSubscriptionTypesApi";
import { useGetClubSubscriptionPackagesQuery } from "../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetUsersQuery } from "../../../store/auth/apiSlice";
import { useGetUserTypesQuery } from "../../../api/endpoints/UserTypesApi";
import { useGetClubExternalMembersQuery } from "../../../api/endpoints/ClubExternalMembersApi";
import PageLoading from "../../../components/loading/PageLoading";

const ClubSubscribersResults = () => {
  const user = useAppSelector((store) => store?.user?.user?.user);

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});

  const { data: userTypes, isLoading: isUserTypesLoading } =
    useGetUserTypesQuery({});

  const {
    data: clubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: clubExternalMembers, isLoading: isExternalMembersLoading } =
    useGetClubExternalMembersQuery({});

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

  const [isAddSubscriberModalOpen, setIsAddSubscriberModalOpen] =
    useState(false);

  const openAddClubSubscriberModal = () => {
    setIsAddSubscriberModalOpen(true);
  };

  const closeAddClubSubscriberModal = () => {
    setIsAddSubscriberModalOpen(false);
  };

  const [isEditSubscriberModalOpen, setIsEditSubscriberModalOpen] =
    useState(false);

  const [selectedClubSubscriptionId, setSelectedClubSubscriptionId] =
    useState(null);

  const [selectedExternalSubscriber, setSelectedExternalSubscriber] =
    useState(null);

  const openEditClubSubscriberModal = (selectedClubSubscriptionId: number) => {
    setIsEditSubscriberModalOpen(true);
    setSelectedClubSubscriptionId(selectedClubSubscriptionId);
    setSelectedExternalSubscriber(
      clubExternalMembers?.find(
        (member) =>
          member.user_id ===
          clubSubscriptions?.find(
            (subscription) =>
              subscription.club_subscription_id === selectedClubSubscriptionId
          )?.player_id
      )
    );
  };

  const closeEditClubSubscriberModal = () => {
    setIsEditSubscriberModalOpen(false);
  };

  const clubSubscriptionPackageExists = clubSubscriptionPackages?.find(
    (subscriptionPackage) =>
      subscriptionPackage.is_active === true &&
      subscriptionPackage.club_id === user?.user_id
  );

  const today = new Date();
  const year = today.getFullYear();

  if (
    isClubSubscriptionsLoading ||
    isPlayersLoading ||
    isLocationsLoading ||
    isPlayerLevelsLoading ||
    isSubscriptionTypesLoading ||
    isClubSubscriptionPackagesLoading ||
    isUsersLoading ||
    isExternalMembersLoading ||
    isUserTypesLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["add-subscription-package-container"]}>
        <h2 className={styles["result-title"]}>Üyeler</h2>
        <button
          onClick={openAddClubSubscriberModal}
          className={styles["add-subscription-package-button"]}
          disabled={!clubSubscriptionPackageExists}
        >
          <FaPlusSquare className={styles["add-icon"]} />
          <h2 className={styles["add-title"]}>
            {clubSubscriptionPackageExists
              ? "Yeni Üye Ekle"
              : "Üyelik Eklemek İçin Üyelik Paketi Ekleyin"}
          </h2>
        </button>
      </div>
      <div className={styles["top-container"]}></div>
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
                <th>Üye Tipi</th>
                <th>Seviye</th>
                <th>Cinsiyet</th>
                <th>Yaş</th>
                <th>Konum</th>
                <th>Üyelik Tipi</th>
                <th>Üyelik Başlangıç</th>
                <th>Üyelik Bitiş</th>
              </tr>
            </thead>
            <tbody>
              {mySubscriptions.map((subscription) => (
                <tr key={subscription.club_subscription_id}>
                  <td>
                    {users?.find(
                      (user) => user.user_id === subscription.player_id
                    )?.user_type_id === 1 ? (
                      <Link
                        to={`${paths.EXPLORE_PROFILE}1/${subscription.player_id}`}
                      >
                        <img
                          src={
                            players?.find(
                              (player) =>
                                player.user_id === subscription.player_id
                            )?.image
                              ? players?.find(
                                  (player) =>
                                    player.user_id === subscription.player_id
                                )?.image
                              : "/images/icons/avatar.png"
                          }
                          alt="subsciption"
                          className={styles["subscription-image"]}
                        />
                      </Link>
                    ) : (
                      <img
                        src="/images/icons/avatar.png"
                        className={styles["subscription-image"]}
                      />
                    )}
                  </td>
                  <td>
                    {users?.find(
                      (user) => user.user_id === subscription?.player_id
                    )?.user_type_id === 1 ? (
                      <Link
                        to={`${paths.EXPLORE_PROFILE}1/${subscription.player_id}`}
                        className={styles["subscriber-name"]}
                      >
                        {`${
                          players?.find(
                            (player) =>
                              player.user_id === subscription.player_id
                          )?.fname
                        }
                        ${
                          players?.find(
                            (player) =>
                              player.user_id === subscription.player_id
                          )?.lname
                        }
                        `}
                      </Link>
                    ) : users?.find(
                        (user) => user.user_id === subscription?.player_id
                      )?.user_type_id === 5 ? (
                      `${
                        clubExternalMembers?.find(
                          (member) => member.user_id === subscription.player_id
                        )?.fname
                      } ${
                        clubExternalMembers?.find(
                          (member) => member.user_id === subscription.player_id
                        )?.lname
                      }`
                    ) : (
                      ""
                    )}
                  </td>
                  <td>
                    {
                      userTypes?.find(
                        (type) =>
                          type.user_type_id ===
                          users?.find(
                            (user) => user.user_id === subscription?.player_id
                          )?.user_type_id
                      )?.user_type_name
                    }
                  </td>
                  <td>
                    {users?.find(
                      (user) => user.user_id === subscription?.player_id
                    )?.user_type_id === 1
                      ? playerLevels?.find(
                          (level) =>
                            level.player_level_id ===
                            players?.find(
                              (player) =>
                                player.user_id === subscription.player_id
                            )?.player_level_id
                        )?.player_level_name
                      : users?.find(
                          (user) => user.user_id === subscription?.player_id
                        )?.user_type_id === 5
                      ? playerLevels?.find(
                          (level) =>
                            level.player_level_id ===
                            clubExternalMembers?.find(
                              (member) =>
                                member.user_id === subscription?.player_id
                            )?.player_level_id
                        )?.player_level_name
                      : "-"}
                  </td>
                  <td>
                    {users?.find(
                      (user) => user.user_id === subscription?.player_id
                    )?.user_type_id === 1
                      ? players?.find(
                          (player) => player.user_id === subscription.player_id
                        )?.gender
                      : users?.find(
                          (user) => user.user_id === subscription?.player_id
                        )?.user_type_id === 5 &&
                        clubExternalMembers?.find(
                          (member) => member.user_id === subscription.player_id
                        )?.gender
                      ? clubExternalMembers?.find(
                          (member) => member.user_id === subscription.player_id
                        )?.gender
                      : "-"}
                  </td>
                  <td>
                    {users?.find(
                      (user) => user.user_id === subscription?.player_id
                    )?.user_type_id === 1
                      ? year -
                        players?.find(
                          (player) => player.user_id === subscription.player_id
                        )?.birth_year
                      : users?.find(
                          (user) => user.user_id === subscription?.player_id
                        )?.user_type_id === 5 &&
                        clubExternalMembers?.find(
                          (member) => member.user_id === subscription.player_id
                        )?.birth_year
                      ? year -
                        Number(
                          clubExternalMembers?.find(
                            (member) =>
                              member.user_id === subscription.player_id
                          )?.birth_year
                        )
                      : "-"}
                  </td>
                  <td>
                    {users?.find(
                      (user) => user.user_id === subscription?.player_id
                    )?.user_type_id === 1
                      ? locations?.find(
                          (location) =>
                            location.location_id ===
                            players?.find(
                              (player) =>
                                player.user_id === subscription.player_id
                            )?.location_id
                        )?.location_name
                      : users?.find(
                          (user) => user.user_id === subscription?.player_id
                        )?.user_type_id === 5
                      ? locations?.find(
                          (location) =>
                            location.location_id ===
                            clubExternalMembers?.find(
                              (member) =>
                                member.user_id === subscription?.player_id
                            )?.location_id
                        )?.location_name
                      : "-"}
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
                    {users?.find(
                      (user) => user.user_id === subscription?.player_id
                    )?.user_type_id === 1 ? (
                      <Link
                        to={`${paths.EXPLORE_PROFILE}1/${subscription.player_id} `}
                      >
                        <button className={styles["view-button"]}>
                          Görüntüle
                        </button>
                      </Link>
                    ) : users?.find(
                        (user) => user.user_id === subscription?.player_id
                      )?.user_type_id === 5 ? (
                      <button
                        onClick={() =>
                          openEditClubSubscriberModal(
                            subscription.club_subscription_id
                          )
                        }
                        className={styles["view-button"]}
                      >
                        Güncelle
                      </button>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      <AddClubSubscriberModal
        isAddSubscriberModalOpen={isAddSubscriberModalOpen}
        closeAddClubSubscriberModal={closeAddClubSubscriberModal}
      />
      <EditClubSubscriberModal
        isEditSubscriberModalOpen={isEditSubscriberModalOpen}
        closeEditClubSubscriberModal={closeEditClubSubscriberModal}
        selectedClubSubscriptionId={selectedClubSubscriptionId}
        selectedExternalSubscriber={selectedExternalSubscriber}
      />
    </div>
  );
};
export default ClubSubscribersResults;
