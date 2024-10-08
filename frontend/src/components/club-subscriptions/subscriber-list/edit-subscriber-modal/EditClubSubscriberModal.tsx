import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../../store/hooks";
import {
  useUpdateClubExternalMemberMutation,
  useGetClubExternalMembersQuery,
  useGetClubExternalMembersByFilterQuery,
} from "../../../../../api/endpoints/ClubExternalMembersApi";
import { ClubSubscriptionPackage } from "../../../../../api/endpoints/ClubSubscriptionPackagesApi";
import { useGetClubSubscriptionTypesQuery } from "../../../../../api/endpoints/ClubSubscriptionTypesApi";
import { Location } from "../../../../../api/endpoints/LocationsApi";
import {
  useGetClubSubscriptionsQuery,
  useUpdateClubSubscriptionMutation,
} from "../../../../../api/endpoints/ClubSubscriptionsApi";
import { PlayerLevel } from "../../../../../api/endpoints/PlayerLevelsApi";
import PageLoading from "../../../../components/loading/PageLoading";
import { useTranslation } from "react-i18next";

interface EditClubSubscriberModalProps {
  isEditSubscriberModalOpen: boolean;
  closeEditClubSubscriberModal: () => void;
  selectedSubscriptionDetails: any;
  locations: Location[];
  playerLevels: PlayerLevel[];
  mySubscriptionPackages: ClubSubscriptionPackage[];
}

type FormValues = {
  member_id: string;
  email: string;
  fname: string;
  lname: string;
  birth_year: number;
  gender: string;
  location_id: number;
  player_level_id: number;
  club_subscription_package_id: number;
};

const EditClubSubscriberModal = (props: EditClubSubscriberModalProps) => {
  const {
    isEditSubscriberModalOpen,
    closeEditClubSubscriberModal,
    selectedSubscriptionDetails,
    locations,
    playerLevels,
    mySubscriptionPackages,
  } = props;

  const { t } = useTranslation();

  const user = useAppSelector((store) => store?.user?.user);

  const [selectedClubPackage, setSelectedClubPackage] = useState(null);

  const { refetch: refetchClubSubscribers } = useGetClubSubscriptionsQuery({});

  const {
    data: clubSubscriptionTypes,
    isLoading: isClubSubscriptionTypesLoading,
  } = useGetClubSubscriptionTypesQuery({});

  const { refetch: refetchClubExternalSubscribers } =
    useGetClubExternalMembersQuery({});

  const { refetch: refetchClubExternalSubscriber } =
    useGetClubExternalMembersByFilterQuery({
      club_id: user?.clubDetails?.club_id,
      is_active: true,
    });

  const [
    editClubExternalSubscriber,
    {
      data: updatedExternalSubscriberData,
      isSuccess: isUpdateClubExternalSubscriberSuccess,
    },
  ] = useUpdateClubExternalMemberMutation({});

  const [editClubSubscription, { isSuccess: isEditClubSubscriptionSuccess }] =
    useUpdateClubSubscriptionMutation({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      member_id: selectedSubscriptionDetails?.member_id,
      email: selectedSubscriptionDetails?.email || "",
      fname: selectedSubscriptionDetails?.fname,
      lname: selectedSubscriptionDetails?.lname,
      birth_year: Number(selectedSubscriptionDetails?.birth_year),
      gender: selectedSubscriptionDetails?.gender || "",
      club_subscription_package_id: Number(
        selectedSubscriptionDetails?.club_subscription_package_id
      ),
      player_level_id: Number(selectedSubscriptionDetails?.player_level_id),
      location_id: Number(selectedSubscriptionDetails?.location_id),
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      const selectedPackage = mySubscriptionPackages?.find(
        (selectedPackage) =>
          selectedPackage.club_subscription_package_id ===
          Number(formData?.club_subscription_package_id)
      );

      setSelectedClubPackage(selectedPackage);

      const updatedExternalSubscriber = {
        club_external_member_id:
          selectedSubscriptionDetails?.club_external_member_id,
        member_id: formData?.member_id,
        email: formData?.email,
        fname: formData?.fname,
        lname: formData?.lname,
        birth_year: String(formData?.birth_year),
        gender: formData?.gender,
        location_id: Number(formData?.location_id),
        player_level_id: Number(formData?.player_level_id),
        is_active: true,
        club_id: user?.clubDetails?.club_id,
      };

      editClubExternalSubscriber(updatedExternalSubscriber);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteExternalMember = () => {
    const selectedPackage =
      selectedSubscriptionDetails?.club_subscription_package_id;

    setSelectedClubPackage(selectedPackage);

    const deletedExternalMemberData = {
      club_external_member_id:
        selectedSubscriptionDetails?.club_external_member_id,
      member_id: selectedSubscriptionDetails?.member_id,
      email: selectedSubscriptionDetails?.email,
      fname: selectedSubscriptionDetails?.fname,
      lname: selectedSubscriptionDetails?.lname,
      birth_year: String(selectedSubscriptionDetails?.birth_year),
      gender: selectedSubscriptionDetails?.gender,
      location_id: Number(selectedSubscriptionDetails?.location_id),
      player_level_id: Number(selectedSubscriptionDetails?.player_level_id),
      is_active: false,
      club_id: user?.clubDetails?.club_id,
    };
    editClubExternalSubscriber(deletedExternalMemberData);
  };

  useEffect(() => {
    if (selectedSubscriptionDetails) {
      reset({
        member_id: selectedSubscriptionDetails?.member_id,
        email: selectedSubscriptionDetails?.email || "",
        fname: selectedSubscriptionDetails?.fname,
        lname: selectedSubscriptionDetails?.lname,
        birth_year: Number(selectedSubscriptionDetails?.birth_year),
        gender: selectedSubscriptionDetails?.gender || "",
        club_subscription_package_id:
          Number(selectedSubscriptionDetails?.club_subscription_package_id) ||
          null,
        location_id: selectedSubscriptionDetails?.location_id || null,
        player_level_id: selectedSubscriptionDetails?.player_level_id || null,
      });
    }
  }, [selectedSubscriptionDetails]);

  useEffect(() => {
    if (
      isUpdateClubExternalSubscriberSuccess &&
      updatedExternalSubscriberData
    ) {
      const currentDate = new Date();

      const startDate = currentDate.toISOString();

      const packageDurationMonths = clubSubscriptionTypes?.find(
        (type) =>
          type.club_subscription_type_id ===
          selectedClubPackage?.club_subscription_type_id
      )?.club_subscription_duration_months;

      const endDate = new Date();

      packageDurationMonths
        ? endDate.setMonth(endDate.getMonth() + Number(packageDurationMonths))
        : endDate.setMonth(
            endDate.getMonth() +
              Number(
                selectedSubscriptionDetails?.club_subscription_duration_months
              )
          );

      const updatedClubSubscription = {
        club_subscription_id: selectedSubscriptionDetails?.club_subscription_id,
        registered_at: selectedSubscriptionDetails?.registered_at,
        start_date: startDate,
        end_date: endDate,
        club_subscription_package_id:
          selectedClubPackage?.club_subscription_package_id,
        is_active: updatedExternalSubscriberData[0].is_active,
        payment_id: selectedSubscriptionDetails?.payment_id,
        club_id: user?.user?.user_id,
        player_id: selectedSubscriptionDetails?.playerUserId
          ? selectedSubscriptionDetails?.playerUserId
          : selectedSubscriptionDetails?.clubExternalMemberUserId
          ? selectedSubscriptionDetails?.clubExternalMemberUserId
          : null,
      };
      editClubSubscription(updatedClubSubscription);
    }
  }, [isUpdateClubExternalSubscriberSuccess]);

  useEffect(() => {
    if (isEditClubSubscriptionSuccess) {
      toast.success("İşlem başarılı");
      refetchClubSubscribers();
      closeEditClubSubscriberModal();
    }
  }, [isEditClubSubscriptionSuccess]);

  useEffect(() => {
    if (isUpdateClubExternalSubscriberSuccess) {
      refetchClubExternalSubscribers();
      refetchClubExternalSubscriber();
    }
  }, [isUpdateClubExternalSubscriberSuccess]);

  if (isClubSubscriptionTypesLoading) {
    return <PageLoading />;
  }
  return (
    <ReactModal
      isOpen={isEditSubscriberModalOpen}
      onRequestClose={closeEditClubSubscriberModal}
      className={styles["modal-container"]}
      shouldCloseOnOverlayClick={false}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={closeEditClubSubscriberModal}
      />
      <div className={styles["modal-content"]}>
        <div className={styles["top-container"]}>
          <h1 className={styles.title}>{t("editMemberTitle")}</h1>
          <button
            onClick={handleDeleteExternalMember}
            className={styles["delete-button"]}
          >
            {t("deleteSubscriber")}
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
        >
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>{t("firstName")}</label>
              <input {...register("fname", { required: true })} type="text" />
              {errors.fname && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>{t("lastName")}</label>
              <input {...register("lname", { required: true })} type="text" />
              {errors.lname && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>{t("offlineSubscriberNo")}</label>
              <input {...register("member_id")} type="text" />
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>{t("loginEmailLabel")}</label>
              <input {...register("email")} type="email" />
            </div>
            <div className={styles["input-container"]}>
              <label>{t("birthYear")}</label>
              <input
                {...register("birth_year", { required: true })}
                type="number"
              />
              {errors.birth_year && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>{t("gender")}</label>
              <select {...register("gender", { required: true })}>
                <option value="">-- {t("gender")} --</option>
                <option value="female">{t("female")}</option>
                <option value="male">{t("male")}</option>
              </select>
              {errors.gender && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>{t("subscriptionType")}</label>
              <select
                {...register("club_subscription_package_id", {
                  required: true,
                })}
              >
                {mySubscriptionPackages?.map((clubPackage) => (
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
                      clubPackage?.club_subscription_type_id === 1
                        ? t("oneMonthSubscription")
                        : clubPackage?.club_subscription_type_id === 2
                        ? t("threeMonthSubscription")
                        : clubPackage?.club_subscription_type_id === 3
                        ? t("sixMonthSubscription")
                        : t("twelveMonthSubscription")
                    } - ${clubPackage.price} TL
                 `}
                  </option>
                ))}
              </select>
              {errors.club_subscription_package_id && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>{t("tableLevelHeader")}</label>
              <select {...register("player_level_id", { required: true })}>
                <option value="">-- {t("tableLevelHeader")} --</option>
                {playerLevels?.map((level) => (
                  <option
                    key={level.player_level_id}
                    value={level.player_level_id}
                  >
                    {level?.player_level_id === 1 && level?.player_level_id
                      ? t("playerLevelBeginner")
                      : level?.player_level_id === 2
                      ? t("playerLevelIntermediate")
                      : level?.player_level_id === 3
                      ? t("playerLevelAdvanced")
                      : level?.player_level_id === 4
                      ? t("playerLevelProfessinal")
                      : ""}
                  </option>
                ))}
              </select>
              {errors.player_level_id && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>{t("tableLocationHeader")}</label>
              <select {...register("location_id", { required: true })}>
                <option value="">-- {t("tableLocationHeader")} --</option>{" "}
                {locations?.map((location) => (
                  <option
                    key={location.location_id}
                    value={location.location_id}
                  >
                    {location.location_name}
                  </option>
                ))}
              </select>
              {errors.location_id && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
          </div>
          <div className={styles["buttons-container"]}>
            <button
              onClick={closeEditClubSubscriberModal}
              className={styles["discard-button"]}
            >
              {t("discardButtonText")}
            </button>
            <button type="submit" className={styles["submit-button"]}>
              {t("submit")}
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};

export default EditClubSubscriberModal;
