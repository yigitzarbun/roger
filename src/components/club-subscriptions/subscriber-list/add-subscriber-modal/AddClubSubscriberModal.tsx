import React, { useEffect, useState } from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import {
  useAddClubExternalMemberMutation,
  useGetClubExternalMembersQuery,
} from "../../../../api/endpoints/ClubExternalMembersApi";

import { useGetClubSubscriptionPackagesQuery } from "../../../../api/endpoints/ClubSubscriptionPackagesApi";

import { useAddUserMutation } from "../../../../store/auth/apiSlice";
import { useGetUserTypesQuery } from "../../../../api/endpoints/UserTypesApi";
import { useGetUserStatusTypesQuery } from "../../../../api/endpoints/UserStatusTypesApi";
import { useGetClubSubscriptionTypesQuery } from "../../../../api/endpoints/ClubSubscriptionTypesApi";
import {
  useAddClubSubscriptionMutation,
  useGetClubSubscriptionsQuery,
} from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import PageLoading from "../../../../components/loading/PageLoading";

interface AddClubSubscriberModalProps {
  isAddSubscriberModalOpen: boolean;
  closeAddClubSubscriberModal: () => void;
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
  const { isAddSubscriberModalOpen, closeAddClubSubscriberModal } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const { data: userTypes, isLoading: isUserTypesLoading } =
    useGetUserTypesQuery({});

  const { data: userStatusTypes, isLoading: isUserStatusTypesLoading } =
    useGetUserStatusTypesQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { refetch: refetchClubSubscribers } = useGetClubSubscriptionsQuery({});

  const {
    data: clubSubscriptionTypes,
    isLoading: isClubSubscriptionTypesLoading,
  } = useGetClubSubscriptionTypesQuery({});

  const {
    data: clubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
  } = useGetClubSubscriptionPackagesQuery({});

  const { refetch: refetchClubExternalSubscribers } =
    useGetClubExternalMembersQuery({});

  const [
    addClubExternalSubscriber,
    { isSuccess: isAddClubExternalSubscriberSuccess },
  ] = useAddClubExternalMemberMutation({});

  const [addUser, { data: newUserData }] = useAddUserMutation();

  const [addSubscription, { isSuccess: isAddSubscriptionSuccess }] =
    useAddClubSubscriptionMutation({});

  const myPackages = clubSubscriptionPackages?.filter(
    (subscriptionPackage) =>
      subscriptionPackage.club_id === user?.user?.user_id &&
      subscriptionPackage.is_active === true
  );

  const [selectedClubPackage, setSelectedClubPackage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    const userRegisterData = {
      email: `${formData?.fname}${Date.now()}@dummyemail.com`,
      password: String(Date.now()),
      user_type_id: userTypes?.find(
        (u) => u.user_type_name === "club_external_member"
      ).user_type_id,
      user_status_type_id: userStatusTypes?.find(
        (u) => u.user_status_type_name === "active"
      ).user_status_type_id,
    };
    try {
      const selectedPackage = myPackages?.find(
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
      refetchClubExternalSubscribers();
      refetchClubSubscribers();
      reset();
      closeAddClubSubscriberModal();
    }
  }, [isAddSubscriptionSuccess, isAddClubExternalSubscriberSuccess]);

  if (
    isClubSubscriptionPackagesLoading ||
    isUserTypesLoading ||
    isUserStatusTypesLoading ||
    isClubSubscriptionTypesLoading ||
    isLocationsLoading ||
    isPlayerLevelsLoading
  ) {
    return <PageLoading />;
  }
  return (
    <Modal
      isOpen={isAddSubscriberModalOpen}
      onRequestClose={closeAddClubSubscriberModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1 className={styles.title}>Yeni Üye Ekle</h1>
        <FaWindowClose
          onClick={closeAddClubSubscriberModal}
          className={styles["close-icon"]}
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
      >
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>İsim</label>
            <input {...register("fname", { required: true })} type="text" />
            {errors.fname && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Soyisim</label>
            <input {...register("lname", { required: true })} type="text" />
            {errors.lname && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Üye No.</label>
            <input {...register("member_id")} type="text" />
          </div>
        </div>
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>E-posta</label>
            <input {...register("email")} type="email" />
          </div>
          <div className={styles["input-container"]}>
            <label>Doğum Yılı</label>
            <input
              {...register("birth_year", { required: true })}
              type="number"
            />
            {errors.birth_year && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Cinsiyet</label>
            <select {...register("gender", { required: true })}>
              <option value="">-- Cinsiyet --</option>
              <option value="female">Kadın</option>
              <option value="male">Erkek</option>
            </select>
            {errors.gender && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>Üyelik Türü</label>
            <select
              {...register("club_subscription_package_id", { required: true })}
            >
              <option value="">-- Üyelik Türü --</option>
              {myPackages?.map((clubPackage) => (
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
          <div className={styles["input-container"]}>
            <label>Oyuncu Seviyesi</label>
            <select {...register("player_level_id", { required: true })}>
              <option value="">-- Seviye --</option>
              {playerLevels?.map((level) => (
                <option
                  key={level.player_level_id}
                  value={level.player_level_id}
                >
                  {level.player_level_name}
                </option>
              ))}
            </select>
            {errors.player_level_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Konum</label>
            <select {...register("location_id", { required: true })}>
              <option value="">-- Konum --</option>
              {locations?.map((location) => (
                <option key={location.location_id} value={location.location_id}>
                  {location.location_name}
                </option>
              ))}
            </select>
            {errors.location_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <button type="submit" className={styles["form-button"]}>
          Tamamla
        </button>
      </form>
    </Modal>
  );
};

export default AddClubSubscriberModal;
