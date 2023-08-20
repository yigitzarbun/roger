import React, { useEffect, useState } from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

import {
  useAddClubSubscriptionMutation,
  useGetClubSubscriptionsQuery,
} from "../../../api/endpoints/ClubSubscriptionsApi";
import { useGetClubSubscriptionPackagesQuery } from "../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetClubSubscriptionTypesQuery } from "../../../api/endpoints/ClubSubscriptionTypesApi";
import { useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import {
  useAddPaymentMutation,
  useGetPaymentsQuery,
} from "../../../api/endpoints/PaymentsApi";

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

  const {
    data: clubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesQuery({});

  const {
    data: clubSubscriptionTypes,
    isLoading: isClubSubscriptionTypesLoading,
  } = useGetClubSubscriptionTypesQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const [selectedClubPackage, setSelectedClubPackage] = useState(null);

  let playerPaymentDetailsExist = false;

  const currentPlayer = players?.find(
    (player) => player.user_id === user?.user?.user_id
  );

  if (
    currentPlayer?.name_on_card &&
    currentPlayer?.card_number &&
    currentPlayer?.cvc &&
    currentPlayer?.card_expiry
  ) {
    playerPaymentDetailsExist = true;
  }

  const selectedClubPackages = clubSubscriptionPackages?.filter(
    (clubPackage) =>
      clubPackage.club_id === selectedClubId && clubPackage.is_active === true
  );

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
          payment_amount: clubSubscriptionPackages?.find(
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
      const currentDate = new Date();
      const startDate = currentDate.toISOString();
      const packageDurationMonths = clubSubscriptionTypes?.find(
        (type) =>
          type.club_subscription_type_id ===
          selectedClubPackage?.club_subscription_type_id
      )?.club_subscription_duration_months;

      // Convert to local time zone for endDate calculation
      const endDate = new Date(currentDate);
      endDate.setMonth(currentDate.getMonth() + packageDurationMonths);

      // Adjust for local time zone offset
      const timeZoneOffset = currentDate.getTimezoneOffset();
      endDate.setMinutes(endDate.getMinutes() - timeZoneOffset);

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
      refetchPayments();
      reset();
      handleCloseSubscribeModal();
    }
  }, [isSubscriptionSuccess]);

  if (
    isClubSubscriptionPackagesLoading ||
    isClubSubscriptionTypesLoading ||
    isClubSubscriptionsLoading ||
    isPlayersLoading ||
    isPaymentsLoading
  ) {
    return <div>Yükleniyor..</div>;
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
                      clubSubscriptionTypes?.find(
                        (type) =>
                          type.club_subscription_type_id ===
                          clubPackage.club_subscription_type_id
                      )?.club_subscription_type_name
                    } - ${
                    clubSubscriptionTypes?.find(
                      (type) =>
                        type.club_subscription_type_id ===
                        clubPackage.club_subscription_type_id
                    )?.club_subscription_duration_months
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
