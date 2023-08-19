import React, { useEffect } from "react";

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

  const [addSubscription, { isSuccess }] = useAddClubSubscriptionMutation({});

  const { isLoading: isClubSubscriptionsLoading, refetch } =
    useGetClubSubscriptionsQuery({});

  const {
    data: clubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesQuery({});

  const {
    data: clubSubscriptionTypes,
    isLoading: isClubSubscriptionTypesLoading,
  } = useGetClubSubscriptionTypesQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

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
      const selectedSubscriptionType = clubSubscriptionTypes?.find(
        (type) =>
          type.club_subscription_type_id ===
          selectedPackage?.club_subscription_type_id
      );
      if (selectedPackage && selectedSubscriptionType) {
        const currentDate = new Date();
        const startDate = currentDate.toISOString();

        // Convert to local time zone for endDate calculation
        const endDate = new Date(currentDate);
        endDate.setMonth(
          currentDate.getMonth() +
            parseInt(selectedSubscriptionType.club_subscription_duration_months)
        );

        // Adjust for local time zone offset
        const timeZoneOffset = currentDate.getTimezoneOffset();
        endDate.setMinutes(endDate.getMinutes() - timeZoneOffset);

        const newSubscriptionData = {
          start_date: startDate,
          end_date: endDate.toISOString(), // Keep this in ISO format for consistency
          club_id: selectedClubId,
          player_id: user?.user?.user_id,
          club_subscription_package_id: Number(
            formData?.club_subscription_package_id
          ),
        };
        if (playerPaymentDetailsExist) {
          addSubscription(newSubscriptionData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      reset();
      handleCloseSubscribeModal();
    }
  }, [isSuccess]);

  if (
    isClubSubscriptionPackagesLoading ||
    isClubSubscriptionTypesLoading ||
    isClubSubscriptionsLoading ||
    isPlayersLoading
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
