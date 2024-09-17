import React from "react";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";
import { ImBlocked } from "react-icons/im";
import styles from "./styles.module.scss";
import { Club } from "../../../../../../../api/endpoints/ClubsApi";
import PageLoading from "../../../../../../components/loading/PageLoading";
import { useAppSelector } from "../../../../../../store/hooks";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useGetClubSubscriptionsByFilterQuery } from "../../../../../../../api/endpoints/ClubSubscriptionsApi";

interface ExploreClubSubscriptionsModalProps {
  isSubscriptionsModalOpen: boolean;
  closeSubscriptionsModal: () => void;
  selectedClub: Club;
  selectedClubSubscriptionPackages: any[];
  playerPaymentDetailsExist: boolean;
  handleOpenSubscribeModal: (value: number) => void;
}

const ExploreClubSubscriptionsModal = (
  props: ExploreClubSubscriptionsModalProps
) => {
  const {
    isSubscriptionsModalOpen,
    closeSubscriptionsModal,
    selectedClub,
    selectedClubSubscriptionPackages,
    playerPaymentDetailsExist,
    handleOpenSubscribeModal,
  } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const { t } = useTranslation();

  const isUserPlayer = user?.user?.user_type_id === 1;

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsByFilterQuery({
      is_active: true,
      club_id: selectedClub?.[0]?.user_id,
    });

  const isUserSubscribedToClubPackage = (
    club_subscription_package_id: number
  ) => {
    const activeSubscription = clubSubscriptions?.find(
      (subscription) =>
        subscription.player_id === user?.user?.user_id &&
        subscription.is_active === true &&
        subscription.club_subscription_package_id ===
          club_subscription_package_id
    );
    return activeSubscription ? true : false;
  };

  const {
    data: isUserSubscribedToClub,
    isLoading: isUserSubscribedtoClubLoading,
  } = useGetClubSubscriptionsByFilterQuery({
    is_active: true,
    club_id: selectedClub?.[0]?.user_id,
    player_id: user?.user?.user_id,
  });

  const numberOfSubscribers = (club_subscription_package_id: number) => {
    return clubSubscriptions?.filter(
      (subscription) =>
        subscription.club_subscription_package_id ===
        club_subscription_package_id
    )?.length;
  };
  if (isClubSubscriptionsLoading || isUserSubscribedtoClubLoading) {
    return <PageLoading />;
  }
  return (
    <ReactModal
      isOpen={isSubscriptionsModalOpen}
      onRequestClose={closeSubscriptionsModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeSubscriptionsModal} />
      <div className={styles["modal-content"]}>
        <div className={styles["top-container"]}>
          <h1>{t("subscriptions")}</h1>
        </div>
        <div className={styles["table-container"]}>
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
                    {clubPackage?.club_subscription_duration_months}{" "}
                    {t("month")}
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
                        <button
                          onClick={() => handleOpenSubscribeModal}
                          disabled={!playerPaymentDetailsExist}
                        >
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
        </div>
      </div>
    </ReactModal>
  );
};
export default ExploreClubSubscriptionsModal;
