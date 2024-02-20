import React, { useState } from "react";

import { ImBlocked } from "react-icons/im";

import styles from "./styles.module.scss";

import ExploreClubSubscriptionsModal from "../../modals/subscriptions/ExploreClubSubscriptionsModal";
import SubscribeToClubModal from "../../../../subscribe-club-modal/SubscribeToClubModal";
import PageLoading from "../../../../../../components/loading/PageLoading";

import { useGetClubSubscriptionTypesQuery } from "../../../../../../api/endpoints/ClubSubscriptionTypesApi";
import { useGetClubSubscriptionPackagesByFilterQuery } from "../../../../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetPlayerByUserIdQuery } from "../../../../../../api/endpoints/PlayersApi";

import { Club } from "../../../../../../api/endpoints/ClubsApi";
import {
  ClubSubscription,
  useGetClubSubscriptionsByFilterQuery,
} from "../../../../../../api/endpoints/ClubSubscriptionsApi";
import { useAppSelector } from "../../../../../../store/hooks";

interface ExploreClubsSubscriptionsSectionProps {
  selectedClub: any;
  selectedClubSubscribers: ClubSubscription[];
  isUserPlayer: boolean;
}
const ExploreClubsSubscriptionsSection = (
  props: ExploreClubsSubscriptionsSectionProps
) => {
  const { selectedClub, selectedClubSubscribers, isUserPlayer } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: clubSubscriptionTypes,
    isLoading: isClubSubscriptionTypesLoading,
  } = useGetClubSubscriptionTypesQuery({});

  const {
    data: selectedClubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesByFilterQuery({
    club_id: selectedClub?.[0]?.user_id,
    is_active: true,
  });

  const isUserSubscribedToClubPackage = (
    club_subscription_package_id: number
  ) => {
    return selectedClubSubscribers?.find(
      (subscription) =>
        subscription.player_id === user?.user?.user_id &&
        subscription.club_subscription_package_id ===
          club_subscription_package_id
    )
      ? true
      : false;
  };

  const {
    data: isUserSubscribedToClub,
    isLoading: isUserSubscribedtoClubLoading,
  } = useGetClubSubscriptionsByFilterQuery({
    is_active: true,
    club_id: selectedClub?.[0]?.user_id,
    player_id: user?.user?.user_id,
  });

  const { data: currentPlayer, isLoading: isPlayersLoading } =
    useGetPlayerByUserIdQuery(user?.user?.user_id);

  let playerPaymentDetailsExist = false;

  if (isUserPlayer) {
    if (
      currentPlayer?.[0]?.name_on_card &&
      currentPlayer?.[0]?.card_number &&
      currentPlayer?.[0]?.cvc &&
      currentPlayer?.[0]?.card_expiry
    ) {
      playerPaymentDetailsExist = true;
    }
  }

  const [isSubscriptionsModalOpen, setIsSubscriptionsModalOpen] =
    useState(false);
  const openSubscriptionsModal = () => {
    setIsSubscriptionsModalOpen(true);
  };
  const closeSubscriptionsModal = () => {
    setIsSubscriptionsModalOpen(false);
  };
  const [openSubscribeModal, setOpenSubscribeModal] = useState(false);

  const [selectedClubId, setSelectedClubId] = useState(null);

  const handleOpenSubscribeModal = (value: number) => {
    setOpenSubscribeModal(true);
    setIsSubscriptionsModalOpen(false);
    setSelectedClubId(value);
  };
  const handleCloseSubscribeModal = () => {
    setOpenSubscribeModal(false);
    setSelectedClubId(null);
  };

  if (
    isClubSubscriptionTypesLoading ||
    isClubSubscriptionPackagesLoading ||
    isPlayersLoading ||
    isUserSubscribedtoClubLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["subscriptions-section"]}>
      <h2>Üyelikler</h2>
      {selectedClubSubscriptionPackages?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Abonelik Türü</th>
              <th>Abonelik Süresi</th>
              <th>Fiyat (TL)</th>
              <th>Üyelik</th>
            </tr>
          </thead>
          <tbody>
            {selectedClubSubscriptionPackages
              ?.slice(selectedClubSubscriptionPackages?.length - 2)
              ?.map((clubPackage) => (
                <tr key={clubPackage.club_subscription_package_id}>
                  <td>
                    {
                      clubSubscriptionTypes?.find(
                        (type) =>
                          type.club_subscription_type_id ===
                          clubPackage.club_subscription_type_id
                      )?.club_subscription_type_name
                    }
                  </td>
                  <td>
                    {
                      clubSubscriptionTypes?.find(
                        (type) =>
                          type.club_subscription_type_id ===
                          clubPackage.club_subscription_type_id
                      )?.club_subscription_duration_months
                    }
                  </td>
                  <td>{clubPackage.price}</td>
                  {isUserPlayer && (
                    <td>
                      {isUserSubscribedToClubPackage(
                        clubPackage.club_subscription_package_id
                      ) === true ? (
                        <p className={styles["subscribed-text"]}>Üyelik var</p>
                      ) : isUserSubscribedToClub?.length > 0 &&
                        isUserSubscribedToClubPackage(
                          clubPackage.club_subscription_package_id
                        ) === false ? (
                        <ImBlocked />
                      ) : (
                        <button
                          onClick={() =>
                            handleOpenSubscribeModal(selectedClub?.[0]?.user_id)
                          }
                          disabled={!playerPaymentDetailsExist}
                        >
                          {playerPaymentDetailsExist
                            ? "Üye Ol"
                            : "Üye olmak için ödeme bilgilerini ekle"}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>Henüz kulübe ait abonelik paketi bulunmamaktadır</p>
      )}
      <button onClick={openSubscriptionsModal}>Tümünü Görüntüle</button>
      {isSubscriptionsModalOpen && (
        <ExploreClubSubscriptionsModal
          isSubscriptionsModalOpen={isSubscriptionsModalOpen}
          closeSubscriptionsModal={closeSubscriptionsModal}
          selectedClub={selectedClub}
          selectedClubSubscriptionPackages={selectedClubSubscriptionPackages}
          playerPaymentDetailsExist={playerPaymentDetailsExist}
          handleOpenSubscribeModal={handleOpenSubscribeModal}
        />
      )}
      {openSubscribeModal && (
        <SubscribeToClubModal
          openSubscribeModal={openSubscribeModal}
          handleCloseSubscribeModal={handleCloseSubscribeModal}
          selectedClubId={selectedClubId}
        />
      )}
    </div>
  );
};
export default ExploreClubsSubscriptionsSection;
