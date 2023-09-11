import React, { useEffect, useState } from "react";

import Modal from "react-modal";

import { toast } from "react-toastify";

import { FaWindowClose } from "react-icons/fa";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import {
  useUpdateClubExternalMemberMutation,
  useGetClubExternalMembersQuery,
  ClubExternalMember,
  useGetClubExternalMembersByFilterQuery,
} from "../../../../api/endpoints/ClubExternalMembersApi";

import { ClubSubscriptionPackage } from "../../../../api/endpoints/ClubSubscriptionPackagesApi";

import { useGetClubSubscriptionTypesQuery } from "../../../../api/endpoints/ClubSubscriptionTypesApi";

import { Location } from "../../../../api/endpoints/LocationsApi";

import {
  useGetClubSubscriptionsByFilterQuery,
  useGetClubSubscriptionsQuery,
  useUpdateClubSubscriptionMutation,
} from "../../../../api/endpoints/ClubSubscriptionsApi";

import { PlayerLevel } from "../../../../api/endpoints/PlayerLevelsApi";

import PageLoading from "../../../../components/loading/PageLoading";

interface EditClubSubscriberModalProps {
  isEditSubscriberModalOpen: boolean;
  closeEditClubSubscriberModal: () => void;
  selectedClubSubscriptionId: number;
  selectedExternalSubscriber: ClubExternalMember;
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
    selectedClubSubscriptionId,
    selectedExternalSubscriber,
    locations,
    playerLevels,
    mySubscriptionPackages,
  } = props;

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

  const {
    data: selectedSubscription,
    isLoading: isSelectedSubscriptionLoading,
  } = useGetClubSubscriptionsByFilterQuery({
    club_subscription_id: selectedClubSubscriptionId,
    is_active: true,
  });

  const [editClubSubscription, { isSuccess: isEditClubSubscriptionSuccess }] =
    useUpdateClubSubscriptionMutation({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      member_id: selectedExternalSubscriber?.member_id,
      email: selectedExternalSubscriber?.email || "",
      fname: selectedExternalSubscriber?.fname,
      lname: selectedExternalSubscriber?.lname,
      birth_year: Number(selectedExternalSubscriber?.birth_year),
      gender: selectedExternalSubscriber?.gender || "",
      club_subscription_package_id: Number(
        selectedSubscription?.[0]?.club_subscription_package_id
      ),
      player_level_id: Number(selectedExternalSubscriber?.player_level_id),
      location_id: Number(selectedExternalSubscriber?.location_id),
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
        ...selectedExternalSubscriber,
        member_id: formData?.member_id,
        email: formData?.email,
        fname: formData?.fname,
        lname: formData?.lname,
        birth_year: String(formData?.birth_year),
        gender: formData?.gender,
        location_id: Number(formData?.location_id),
        player_level_id: Number(formData?.player_level_id),
      };
      editClubExternalSubscriber(updatedExternalSubscriber);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteExternalMember = () => {
    const selectedPackage =
      selectedSubscription?.[0]?.club_subscription_package_id;

    setSelectedClubPackage(selectedPackage);

    const deletedExternalMemberData = {
      ...selectedExternalSubscriber,
      is_active: false,
    };
    editClubExternalSubscriber(deletedExternalMemberData);
  };

  useEffect(() => {
    if (selectedExternalSubscriber && selectedSubscription) {
      reset({
        member_id: selectedExternalSubscriber?.member_id,
        email: selectedExternalSubscriber?.email || "",
        fname: selectedExternalSubscriber?.fname,
        lname: selectedExternalSubscriber?.lname,
        birth_year: Number(selectedExternalSubscriber?.birth_year),
        gender: selectedExternalSubscriber?.gender || "",
        club_subscription_package_id:
          Number(selectedSubscription?.[0]?.club_subscription_package_id) ||
          null,
        location_id: selectedExternalSubscriber?.location_id || null,
        player_level_id: selectedExternalSubscriber?.player_level_id || null,
      });
    }
  }, [selectedExternalSubscriber, selectedSubscription]);

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
      endDate.setMonth(endDate.getMonth() + Number(packageDurationMonths));

      const updatedClubSubscription = {
        ...selectedSubscription?.[0],
        start_date: startDate,
        end_date: endDate,
        club_subscription_package_id:
          selectedClubPackage?.club_subscription_package_id,
        is_active: updatedExternalSubscriberData[0].is_active,
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

  if (isClubSubscriptionTypesLoading || isSelectedSubscriptionLoading) {
    return <PageLoading />;
  }

  return (
    <Modal
      isOpen={isEditSubscriberModalOpen}
      onRequestClose={closeEditClubSubscriberModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <div>
          <h1 className={styles.title}>Üye Düzenle</h1>
          <button
            onClick={handleDeleteExternalMember}
            className={styles["delete-subscriber-button"]}
          >
            Üyeyi sil
          </button>
        </div>
        <FaWindowClose
          onClick={closeEditClubSubscriberModal}
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

export default EditClubSubscriberModal;
