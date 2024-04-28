import React, { useEffect, useState } from "react";

import { localUrl } from "../../../common/constants/apiConstants";

import ReactModal from "react-modal";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

import { today } from "../../../common/util/TimeFunctions";

import { useAddClubSubscriptionMutation } from "../../../api/endpoints/ClubSubscriptionsApi";
import { useGetClubSubscriptionPackageDetailsQuery } from "../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetPlayerByUserIdQuery } from "../../../api/endpoints/PlayersApi";
import {
  useAddPaymentMutation,
  useGetPaymentsQuery,
} from "../../../api/endpoints/PaymentsApi";
import PageLoading from "../../../components/loading/PageLoading";
import { toast } from "react-toastify";

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

  const {
    data: selectedClubPackageDetails,
    isLoading: isSelectedClubPackageDetailsLoading,
  } = useGetClubSubscriptionPackageDetailsQuery({
    clubId: selectedClubId,
  });

  const [addSubscription, { isSuccess: isSubscriptionSuccess }] =
    useAddClubSubscriptionMutation({});

  const [addPayment, { data: paymentData, isSuccess: isPaymentSuccess }] =
    useAddPaymentMutation({});

  const { isLoading: isPaymentsLoading, refetch: refetchPayments } =
    useGetPaymentsQuery({});

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      const selectedPackage = selectedClubPackageDetails?.find(
        (selectedPackage) =>
          selectedPackage.club_subscription_package_id ===
          Number(formData?.club_subscription_package_id)
      );

      setSelectedClubPackage(selectedPackage);

      if (selectedPackage && playerPaymentDetailsExist) {
        const paymentData = {
          payment_amount: selectedPackage?.price,
          subscription_price: selectedPackage?.price,
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
      const packageDurationMonths =
        selectedClubPackage?.club_subscription_duration_months;

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
      toast.success("Üyelik başarılı");
      refetchPayments();
      reset();
      handleCloseSubscribeModal();
    }
  }, [isSubscriptionSuccess]);

  if (isCurrentPlayerLoading || isPaymentsLoading) {
    return <PageLoading />;
  }
  console.log(selectedClubPackageDetails);
  return (
    <ReactModal
      isOpen={openSubscribeModal}
      onRequestClose={handleCloseSubscribeModal}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseSubscribeModal} />
      <div className={styles["modal-content"]}>
        <div className={styles["top-container"]}>
          <h1 className={styles.title}>Üye Ol</h1>
        </div>
        <div className={styles["club-container"]}>
          <img
            src={
              selectedClubPackageDetails?.[0]?.image
                ? `${localUrl}/${selectedClubPackageDetails?.[0]?.image}`
                : "/images/icons/avatar.jpg"
            }
            className={styles["club-image"]}
          />
          <p className={styles["club-name"]}>
            {selectedClubPackageDetails?.[0].club_name}
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
        >
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>Üyelik Türü</label>
              <select
                {...register("club_subscription_package_id", {
                  required: true,
                })}
              >
                <option value="">-- Üyelik Türü --</option>
                {selectedClubPackageDetails?.map((clubPackage) => (
                  <option
                    key={clubPackage.club_subscription_package_id}
                    value={clubPackage.club_subscription_package_id}
                  >
                    {`
                    ${clubPackage?.club_subscription_type_name} - ${clubPackage?.club_subscription_duration_months} ay - ${clubPackage.price} TL
                 `}
                  </option>
                ))}
              </select>
              {errors.club_subscription_package_id && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          </div>
          <div className={styles["buttons-container"]}>
            <button
              onClick={handleCloseSubscribeModal}
              className={styles["discard-button"]}
            >
              İptal
            </button>
            <button
              type="submit"
              className={styles["submit-button"]}
              disabled={!playerPaymentDetailsExist}
            >
              Tamamla
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};
export default SubscribeToClubModal;
