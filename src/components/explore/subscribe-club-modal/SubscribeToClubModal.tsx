import React, { useEffect, useState } from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

import { today } from "../../../common/util/TimeFunctions";

import {
  useAddClubSubscriptionMutation,
  useGetClubSubscriptionsByFilterQuery,
  useGetClubSubscriptionsQuery,
} from "../../../api/endpoints/ClubSubscriptionsApi";
import { useGetClubSubscriptionPackagesByFilterQuery } from "../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetClubSubscriptionTypesQuery } from "../../../api/endpoints/ClubSubscriptionTypesApi";
import { useGetPlayerByUserIdQuery } from "../../../api/endpoints/PlayersApi";
import {
  useAddPaymentMutation,
  useGetPaymentsQuery,
} from "../../../api/endpoints/PaymentsApi";
import PageLoading from "../../../components/loading/PageLoading";

interface SubscribeToClubModalProps {
  openSubscribeModal: boolean;
  handleCloseSubscribeModal: () => void;
  selectedClubId: number;
}

type FormValues = {
  club_subscription_type_id: number;
  start_date: string;
  end_date: string;
  club_id: number;
  player_id: number;
  club_subscription_package_id: number;
};

const SubscribeToClubModal = (props: SubscribeToClubModalProps) => {
  const { openSubscribeModal, handleCloseSubscribeModal, selectedClubId } =
    props;

  const user = useAppSelector((store) => store?.user?.user);

  const [addSubscription, { isSuccess: isSubscriptionSuccess }] =
    useAddClubSubscriptionMutation({});

  const [addPayment, { data: paymentData, isSuccess: isPaymentSuccess }] =
    useAddPaymentMutation({});

  const { isLoading: isPaymentsLoading, refetch: refetchPayments } =
    useGetPaymentsQuery({});

  const {
    isLoading: isClubSubscriptionsLoading,
    refetch: refetchSubscriptions,
  } = useGetClubSubscriptionsQuery({});

  const { refetch: refetchMySubscriptions } =
    useGetClubSubscriptionsByFilterQuery({
      is_active: true,
      player_id: user?.user?.user_id,
    });

  const {
    data: selectedClubPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesByFilterQuery({
    club_id: selectedClubId,
    is_active: true,
  });

  const {
    data: clubSubscriptionTypes,
    isLoading: isClubSubscriptionTypesLoading,
  } = useGetClubSubscriptionTypesQuery({});

  const [selectedClubPackage, setSelectedClubPackage] = useState(null);

  let playerPaymentDetailsExist = false;

  const { data: currentPlayer, isLoading: isCurrentPlayerLoading } =
    useGetPlayerByUserIdQuery(user?.user?.user_id);

  if (
    currentPlayer?.[0]?.name_on_card &&
    currentPlayer?.[0]?.card_number &&
    currentPlayer?.[0]?.cvc &&
    currentPlayer?.[0]?.card_expiry
  ) {
    playerPaymentDetailsExist = true;
  }

  const subscriptionType = (club_subscription_type_id: number) => {
    return clubSubscriptionTypes?.find(
      (type) => type.club_subscription_type_id === club_subscription_type_id
    );
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      const selectedPackage = selectedClubPackages?.find(
        (selectedPackage) =>
          selectedPackage.club_subscription_package_id ===
          Number(formData?.club_subscription_package_id)
      );

      setSelectedClubPackage(selectedPackage);

      if (selectedPackage && playerPaymentDetailsExist) {
        const paymentData = {
          payment_amount: selectedClubPackages?.find(
            (subscriptionPackage) =>
              subscriptionPackage.club_subscription_package_id ===
              selectedPackage?.club_subscription_package_id
          )?.price,
          subscription_price: selectedClubPackages?.find(
            (subscriptionPackage) =>
              subscriptionPackage.club_subscription_package_id ===
              selectedPackage?.club_subscription_package_id
          )?.price,
          payment_status: "success",
          payment_type_id: 5,
          sender_subscriber_id: user?.user?.user_id,
          recipient_club_id: selectedClubId,
        };
        addPayment(paymentData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isPaymentSuccess) {
      const startDate = today.toISOString();
      const packageDurationMonths = clubSubscriptionTypes?.find(
        (type) =>
          type.club_subscription_type_id ===
          selectedClubPackage?.club_subscription_type_id
      )?.club_subscription_duration_months;

      // Convert to local time zone for endDate calculation
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + Number(packageDurationMonths));

      const newSubscriptionData = {
        start_date: startDate,
        end_date: endDate.toISOString(),
        club_id: selectedClubId,
        player_id: user?.user?.user_id,
        club_subscription_package_id: Number(
          selectedClubPackage?.club_subscription_package_id
        ),
        payment_id: paymentData?.payment_id,
      };
      addSubscription(newSubscriptionData);
    }
  }, [isPaymentSuccess]);

  useEffect(() => {
    if (isSubscriptionSuccess) {
      refetchSubscriptions();
      refetchMySubscriptions();
      refetchPayments();
      reset();
      handleCloseSubscribeModal();
    }
  }, [isSubscriptionSuccess]);

  if (
    isClubSubscriptionPackagesLoading ||
    isClubSubscriptionTypesLoading ||
    isClubSubscriptionsLoading ||
    isCurrentPlayerLoading ||
    isPaymentsLoading
  ) {
    return <PageLoading />;
  }
  return (
    <Modal
      isOpen={openSubscribeModal}
      onRequestClose={handleCloseSubscribeModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1 className={styles.title}>Üye Ol</h1>
        <FaWindowClose
          onClick={handleCloseSubscribeModal}
          className={styles["close-icon"]}
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
      >
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>Üyelik Türü</label>
            <select
              {...register("club_subscription_package_id", { required: true })}
            >
              <option value="">-- Üyelik Türü --</option>
              {selectedClubPackages?.map((clubPackage) => (
                <option
                  key={clubPackage.club_subscription_package_id}
                  value={clubPackage.club_subscription_package_id}
                >
                  {`
                    ${
                      subscriptionType(clubPackage.club_subscription_type_id)
                        ?.club_subscription_type_name
                    } - ${
                    subscriptionType(clubPackage.club_subscription_type_id)
                      ?.club_subscription_duration_months
                  } ay - ${clubPackage.price} TL
                 `}
                </option>
              ))}
            </select>
            {errors.club_subscription_package_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className={styles["form-button"]}
          disabled={!playerPaymentDetailsExist}
        >
          Tamamla
        </button>
      </form>
    </Modal>
  );
};
export default SubscribeToClubModal;
