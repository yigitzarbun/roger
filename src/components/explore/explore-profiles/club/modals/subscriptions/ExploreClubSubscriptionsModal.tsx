import React from "react";

import ReactModal from "react-modal";

import styles from "./styles.module.scss";

import { Club } from "../../../../../../api/endpoints/ClubsApi";

import PageLoading from "../../../../../../components/loading/PageLoading";

import { useAppSelector } from "../../../../../../store/hooks";

import { ClubSubscriptionPackage } from "../../../../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetClubSubscriptionTypesQuery } from "../../../../../../api/endpoints/ClubSubscriptionTypesApi";
import {
  useGetClubSubscriptionsByFilterQuery,
  useGetClubSubscriptionsQuery,
} from "../../../../../../api/endpoints/ClubSubscriptionsApi";

interface ExploreClubSubscriptionsModalProps {
  isSubscriptionsModalOpen: boolean;
  closeSubscriptionsModal: () => void;
  selectedClub: Club;
  selectedClubSubscriptionPackages: ClubSubscriptionPackage[];
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

  const isUserPlayer = user?.user?.user_type_id === 1;

  const {
    data: clubSubscriptionTypes,
    isLoading: isClubSubscriptionTypesLoading,
  } = useGetClubSubscriptionTypesQuery({});

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsByFilterQuery({
      is_active: true,
      club_id: selectedClub?.[0]?.user_id,
    });

  const isUserSubscribedToClub = (club_subscription_package_id: number) => {
    const activeSubscription = clubSubscriptions?.find(
      (subscription) =>
        subscription.player_id === user?.user?.user_id &&
        subscription.is_active === true &&
        subscription.club_subscription_package_id ===
          club_subscription_package_id
    );
    return activeSubscription ? true : false;
  };

  const numberOfSubscribers = (club_subscription_package_id: number) => {
    return clubSubscriptions?.filter(
      (subscription) =>
        subscription.club_subscription_package_id ===
        club_subscription_package_id
    )?.length;
  };
  if (isClubSubscriptionsLoading || isClubSubscriptionTypesLoading) {
    return <PageLoading />;
  }
  return (
    <ReactModal
      isOpen={isSubscriptionsModalOpen}
      onRequestClose={closeSubscriptionsModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>Üyelik Paketleri</h1>
        <img
          src="/images/icons/close.png"
          onClick={closeSubscriptionsModal}
          className={styles["close-button"]}
        />
      </div>
      <div className={styles["table-container"]}>
        {selectedClubSubscriptionPackages?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Abonelik Türü</th>
                <th>Abonelik Süresi (Ay)</th>
                <th>Üye Sayısı</th>
                <th>Fiyat (TL)</th>
                <th>{isUserPlayer && "Üyelik"}</th>
              </tr>
            </thead>
            <tbody>
              {selectedClubSubscriptionPackages?.map((clubPackage) => (
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
                  <td>
                    {numberOfSubscribers(
                      clubPackage.club_subscription_package_id
                    )}
                  </td>
                  <td>{clubPackage.price}</td>
                  {isUserPlayer && (
                    <td>
                      {isUserSubscribedToClub(
                        clubPackage.club_subscription_package_id
                      ) === true ? (
                        <p className={styles["subscribed-text"]}>Üyelik var</p>
                      ) : (
                        <button
                          disabled={!playerPaymentDetailsExist}
                          className={styles["subscribe-button"]}
                          onClick={() =>
                            handleOpenSubscribeModal(selectedClub?.[0]?.user_id)
                          }
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
      </div>
    </ReactModal>
  );
};
export default ExploreClubSubscriptionsModal;
