import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../../store/hooks";
import {
  useAddClubExternalMemberMutation,
  useGetClubExternalMembersByFilterQuery,
} from "../../../../../api/endpoints/ClubExternalMembersApi";
import { ClubSubscriptionPackage } from "../../../../../api/endpoints/ClubSubscriptionPackagesApi";
import {
  useAddUserMutation,
  useGetUsersQuery,
} from "../../../../store/auth/apiSlice";
import {
  UserType,
  useGetUserStatusTypesQuery,
} from "../../../../../api/endpoints/UserStatusTypesApi";
import { ClubSubscriptionTypes } from "../../../../../api/endpoints/ClubSubscriptionTypesApi";
import {
  useAddClubSubscriptionMutation,
  useGetClubSubscriptionsByFilterQuery,
  useGetClubSubscriptionsQuery,
} from "../../../../../api/endpoints/ClubSubscriptionsApi";
import { Location } from "../../../../../api/endpoints/LocationsApi";
import { PlayerLevel } from "../../../../../api/endpoints/PlayerLevelsApi";
import PageLoading from "../../../../components/loading/PageLoading";
import { useTranslation } from "react-i18next";

interface AddClubSubscriberModalProps {
  isAddSubscriberModalOpen: boolean;
  closeAddClubSubscriberModal: () => void;
  userTypes: UserType[];
  locations: Location[];
  playerLevels: PlayerLevel[];
  clubSubscriptionTypes: ClubSubscriptionTypes[];
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

const AddClubSubscriberModal = (props: AddClubSubscriberModalProps) => {
  const {
    isAddSubscriberModalOpen,
    closeAddClubSubscriberModal,
    userTypes,
    locations,
    playerLevels,
    clubSubscriptionTypes,
    mySubscriptionPackages,
  } = props;

  const { t } = useTranslation();

  const user = useAppSelector((store) => store?.user?.user);

  const { data: userStatusTypes, isLoading: isUserStatusTypesLoading } =
    useGetUserStatusTypesQuery({});

  const { refetch: refetchClubSubscribers } = useGetClubSubscriptionsQuery({});

  const { refetch: refetchMySubscribers } =
    useGetClubSubscriptionsByFilterQuery({
      club_id: user?.user?.user_id,
      is_active: true,
    });

  const { refetch: refetchUsers } = useGetUsersQuery({});

  const { refetch: refetchClubExternalSubscriber } =
    useGetClubExternalMembersByFilterQuery({
      club_id: user?.clubDetails?.club_id,
      is_active: true,
    });

  const [
    addClubExternalSubscriber,
    { isSuccess: isAddClubExternalSubscriberSuccess },
  ] = useAddClubExternalMemberMutation({});

  const [addUser, { data: newUserData }] = useAddUserMutation();

  const [addSubscription, { isSuccess: isAddSubscriptionSuccess }] =
    useAddClubSubscriptionMutation({});

  const [selectedClubPackage, setSelectedClubPackage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    const userRegisterData = {
      email: formData?.email,
      password: String(Date.now()),
      user_type_id: userTypes?.find(
        (u) => u.user_type_name === "club_external_member"
      ).user_type_id,
      user_status_type_id: userStatusTypes?.find(
        (u) => u.user_status_type_name === "active"
      ).user_status_type_id,
      language_id: 1,
    };
    try {
      const selectedPackage = mySubscriptionPackages?.find(
        (selectedPackage) =>
          selectedPackage.club_subscription_package_id ===
          Number(formData?.club_subscription_package_id)
      );

      setSelectedClubPackage(selectedPackage);

      // register user
      const response = await addUser(userRegisterData);

      if ("data" in response) {
        const newUser = response.data;

        const newSubscriber = {
          member_id: formData?.member_id,
          email: formData?.email,
          fname: formData?.fname,
          lname: formData?.lname,
          birth_year: String(formData?.birth_year),
          gender: formData?.gender,
          is_active: true,
          player_level_id: Number(formData?.player_level_id),
          location_id: Number(formData?.location_id),
          club_id: user?.clubDetails?.club_id,
          user_id: newUser.user_id,
        };

        addClubExternalSubscriber(newSubscriber);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const currentDate = new Date();

    const startDate = currentDate.toISOString();

    const packageDurationMonths = clubSubscriptionTypes?.find(
      (type) =>
        type.club_subscription_type_id ===
        selectedClubPackage?.club_subscription_type_id
    )?.club_subscription_duration_months;

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + Number(packageDurationMonths));

    if (isAddClubExternalSubscriberSuccess) {
      const externalMemberSubscriptionData = {
        start_date: startDate,
        end_date: endDate.toISOString(),
        club_id: user?.user?.user_id,
        player_id: newUserData?.user_id,
        club_subscription_package_id: Number(
          selectedClubPackage?.club_subscription_package_id
        ),
        payment_id: null,
      };
      addSubscription(externalMemberSubscriptionData);
    }
  }, [isAddClubExternalSubscriberSuccess]);

  useEffect(() => {
    if (isAddSubscriptionSuccess) {
      toast.success("Üye eklendi");
      refetchClubSubscribers();
      refetchMySubscribers();
      refetchClubExternalSubscriber();
      refetchUsers();
      closeAddClubSubscriberModal();
    }
  }, [isAddSubscriptionSuccess]);

  if (isUserStatusTypesLoading) {
    return <PageLoading />;
  }
  return (
    <ReactModal
      isOpen={isAddSubscriberModalOpen}
      onRequestClose={closeAddClubSubscriberModal}
      className={styles["modal-container"]}
      shouldCloseOnOverlayClick={false}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={closeAddClubSubscriberModal}
      />
      <div className={styles["modal-content"]}>
        <h1 className={styles.title}>{t("addNewSubscriber")}</h1>
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
                <option value="">-- {t("subscriptionType")} --</option>
                {mySubscriptionPackages?.map((clubPackage) => (
                  <option
                    key={clubPackage.club_subscription_package_id}
                    value={clubPackage.club_subscription_package_id}
                  >
                    {`
                     ${
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
                <option value="">-- {t("tableLocationHeader")} --</option>
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
              onClick={closeAddClubSubscriberModal}
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

export default AddClubSubscriberModal;
