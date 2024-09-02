import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImBlocked } from "react-icons/im";
import { IoIosCheckmarkCircle } from "react-icons/io";
import styles from "./styles.module.scss";
import ExploreClubSubscriptionsModal from "../../modals/subscriptions/ExploreClubSubscriptionsModal";
import SubscribeToClubModal from "../../../../subscribe-club-modal/SubscribeToClubModal";
import PageLoading from "../../../../../../components/loading/PageLoading";
import { useGetClubSubscriptionPackageDetailsQuery } from "../../../../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetPlayerByUserIdQuery } from "../../../../../../api/endpoints/PlayersApi";
import {
  useGetClubSubscribersByIdQuery,
  useGetClubSubscriptionsByFilterQuery,
} from "../../../../../../api/endpoints/ClubSubscriptionsApi";

interface ExploreClubsSubscriptionsSectionProps {
  selectedClub: any;
  isUserPlayer: boolean;
  user: any;
}
const ExploreClubsSubscriptionsSection = (
  props: ExploreClubsSubscriptionsSectionProps
) => {
  const { selectedClub, isUserPlayer, user } = props;

  const { t } = useTranslation();

  const {
    data: selectedClubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackageDetailsQuery({
    clubId: selectedClub?.[0]?.user_id,
  });

  const {
    data: selectedClubSubscribers,
    isLoading: isClubSubscribersLoading,
    refetch: refetchClubSubscribers,
  } = useGetClubSubscribersByIdQuery(selectedClub?.[0]?.user_id);

  const isUserSubscribedToClubPackage = (
    club_subscription_package_id: number
  ) => {
    return selectedClubSubscribers?.find(
      (subscription) =>
        subscription.playerUserId === user?.user?.user_id &&
        subscription.club_subscription_package_id ===
          club_subscription_package_id &&
        subscription.is_active === true
    )
      ? true
      : false;
  };

  const {
    data: isUserSubscribedToClub,
    isLoading: isUserSubscribedtoClubLoading,
    refetch: refetchIsUserSubscribed,
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

  // all subscription packages
  const [isSubscriptionsModalOpen, setIsSubscriptionsModalOpen] =
    useState(false);
  const openSubscriptionsModal = () => {
    setIsSubscriptionsModalOpen(true);
  };
  const closeSubscriptionsModal = () => {
    setIsSubscriptionsModalOpen(false);
  };

  // subscribe to club package
  const [openSubscribeModal, setOpenSubscribeModal] = useState(false);

  const handleOpenSubscribeModal = () => {
    setOpenSubscribeModal(true);
  };
  const handleCloseSubscribeModal = () => {
    setOpenSubscribeModal(false);
  };

  useEffect(() => {
    if (openSubscribeModal === false) {
      refetchClubSubscribers();

      refetchIsUserSubscribed();
    }
  }, [openSubscribeModal]);

  if (
    isClubSubscriptionPackagesLoading ||
    isPlayersLoading ||
    isUserSubscribedtoClubLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["subscriptions-section"]}>
      <h2>{t("subscriptions")}</h2>
      {selectedClubSubscriptionPackages?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{t("subscriptionType")}</th>
              <th>{t("subscriptionDuration")}</th>
              <th>{t("price")}</th>
              <th>{t("tableSubscribersHeader")}</th>
              {isUserPlayer && <th>{t("tableSubscriptionHeader")}</th>}
            </tr>
          </thead>
          <tbody>
            {selectedClubSubscriptionPackages?.map((clubPackage) => (
              <tr
                key={clubPackage.club_subscription_package_id}
                className={styles["package-row"]}
              >
                <td>
                  {clubPackage?.club_subscription_type_id === 1
                    ? t("oneMonthSubscription")
                    : clubPackage?.club_subscription_type_id === 2
                    ? t("threeMonthSubscription")
                    : clubPackage?.club_subscription_type_id === 3
                    ? t("sixMonthSubscription")
                    : t("twelveMonthSubscription")}
                </td>
                <td>
                  {clubPackage?.club_subscription_duration_months} {t("month")}
                </td>
                <td>{clubPackage.price} TL</td>
                <td>{clubPackage.subscribercount}</td>
                {isUserPlayer && (
                  <td>
                    {isUserSubscribedToClubPackage(
                      clubPackage.club_subscription_package_id
                    ) === true ? (
                      <IoIosCheckmarkCircle className={styles.done} />
                    ) : isUserSubscribedToClub?.length > 0 &&
                      isUserSubscribedToClubPackage(
                        clubPackage.club_subscription_package_id
                      ) === false ? (
                      <ImBlocked className={styles.blocked} />
                    ) : (
                      <button onClick={handleOpenSubscribeModal}>
                        {playerPaymentDetailsExist
                          ? t("subscribe")
                          : t("subscribeCardDetails")}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{t("clubHasNoSubscriptions")}</p>
      )}
      {selectedClubSubscriptionPackages?.length > 0 && (
        <button onClick={openSubscriptionsModal}>
          {t("leaderBoardViewAllButtonText")}
        </button>
      )}

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
          selectedClubId={selectedClub?.[0]?.user_id}
        />
      )}
    </div>
  );
};
export default ExploreClubsSubscriptionsSection;
