import React, { useState } from "react";

import { Link } from "react-router-dom";

import { FaPlusSquare } from "react-icons/fa";

import { useAppSelector } from "../../../store/hooks";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import AddClubSubscriberModal from "./add-subscriber-modal/AddClubSubscriberModal";
import EditClubSubscriberModal from "./edit-subscriber-modal/EditClubSubscriberModal";
import PageLoading from "../../../components/loading/PageLoading";
import { currentYear } from "../../../common/util/TimeFunctions";

import { useGetClubSubscriptionsByFilterQuery } from "../../../api/endpoints/ClubSubscriptionsApi";
import { useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";
import { useGetClubSubscriptionTypesQuery } from "../../../api/endpoints/ClubSubscriptionTypesApi";
import { useGetClubSubscriptionPackagesByFilterQuery } from "../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetUsersQuery } from "../../../store/auth/apiSlice";
import { useGetUserTypesQuery } from "../../../api/endpoints/UserTypesApi";
import { useGetClubExternalMembersByFilterQuery } from "../../../api/endpoints/ClubExternalMembersApi";

const ClubSubscribersResults = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});

  const { data: userTypes, isLoading: isUserTypesLoading } =
    useGetUserTypesQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { data: subscriptionTypes, isLoading: isSubscriptionTypesLoading } =
    useGetClubSubscriptionTypesQuery({});

  const { data: mySubscriptions, isLoading: isMySubscriptionsLoading } =
    useGetClubSubscriptionsByFilterQuery({
      club_id: user?.user?.user_id,
      is_active: true,
    });

  const { data: myExternalMembers, isLoading: isMyExternalMembersLoading } =
    useGetClubExternalMembersByFilterQuery({
      club_id: user?.clubDetails?.club_id,
      is_active: true,
    });

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
      myExternalMembers?.find(
        (member) =>
          member.user_id ===
          mySubscriptions?.find(
            (subscription) =>
              subscription.club_subscription_id === selectedClubSubscriptionId
          )?.player_id
      )
    );
  };

  const closeEditClubSubscriberModal = () => {
    setIsEditSubscriberModalOpen(false);
  };

  const {
    data: mySubscriptionPackages,
    isLoading: isMySubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesByFilterQuery({
    is_active: true,
    club_id: user?.user?.user_id,
  });

  const selectedExternalMember = (user_id: number) => {
    return myExternalMembers?.find((member) => member.user_id === user_id);
  };
  if (
    isMySubscriptionsLoading ||
    isPlayersLoading ||
    isLocationsLoading ||
    isPlayerLevelsLoading ||
    isSubscriptionTypesLoading ||
    isMySubscriptionPackagesLoading ||
    isUsersLoading ||
    isMyExternalMembersLoading ||
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
          disabled={mySubscriptionPackages?.length === 0}
        >
          <FaPlusSquare className={styles["add-icon"]} />
          <h2 className={styles["add-title"]}>
            {mySubscriptionPackages?.length > 0
              ? "Yeni Üye Ekle"
              : "Üyelik Eklemek İçin Üyelik Paketi Ekleyin"}
          </h2>
        </button>
      </div>
      <div className={styles["top-container"]}></div>
      {players && mySubscriptions.length === 0 && (
        <p>Kayıtlı aktif üye bulunmamaktadır.</p>
      )}
      {players &&
        locations &&
        playerLevels &&
        subscriptionTypes &&
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
                        selectedExternalMember(subscription?.player_id)?.fname
                      } ${
                        selectedExternalMember(subscription?.player_id)?.lname
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
                            selectedExternalMember(subscription?.player_id)
                              ?.player_level_id
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
                        selectedExternalMember(subscription?.player_id)?.gender
                      ? selectedExternalMember(subscription?.player_id)?.gender
                      : "-"}
                  </td>
                  <td>
                    {users?.find(
                      (user) => user.user_id === subscription?.player_id
                    )?.user_type_id === 1
                      ? currentYear -
                        players?.find(
                          (player) => player.user_id === subscription.player_id
                        )?.birth_year
                      : users?.find(
                          (user) => user.user_id === subscription?.player_id
                        )?.user_type_id === 5 &&
                        selectedExternalMember(subscription?.player_id)
                          ?.birth_year
                      ? currentYear -
                        Number(
                          selectedExternalMember(subscription?.player_id)
                            ?.birth_year
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
                            selectedExternalMember(subscription?.player_id)
                              ?.location_id
                        )?.location_name
                      : "-"}
                  </td>
                  <td>
                    {
                      subscriptionTypes?.find(
                        (type) =>
                          type.club_subscription_type_id ===
                          mySubscriptionPackages?.find(
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
      {isAddSubscriberModalOpen && (
        <AddClubSubscriberModal
          isAddSubscriberModalOpen={isAddSubscriberModalOpen}
          closeAddClubSubscriberModal={closeAddClubSubscriberModal}
          userTypes={userTypes}
          locations={locations}
          playerLevels={playerLevels}
          clubSubscriptionTypes={subscriptionTypes}
          mySubscriptionPackages={mySubscriptionPackages}
        />
      )}
      {isEditSubscriberModalOpen && (
        <EditClubSubscriberModal
          isEditSubscriberModalOpen={isEditSubscriberModalOpen}
          closeEditClubSubscriberModal={closeEditClubSubscriberModal}
          selectedClubSubscriptionId={selectedClubSubscriptionId}
          selectedExternalSubscriber={selectedExternalSubscriber}
          locations={locations}
          playerLevels={playerLevels}
          mySubscriptionPackages={mySubscriptionPackages}
        />
      )}
    </div>
  );
};
export default ClubSubscribersResults;
