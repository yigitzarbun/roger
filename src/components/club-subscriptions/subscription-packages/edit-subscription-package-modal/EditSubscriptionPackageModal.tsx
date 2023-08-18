import React, { useEffect, useState } from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import {
  useGetClubSubscriptionPackagesQuery,
  useUpdateClubSubscriptionPackageMutation,
} from "../../../../api/endpoints/ClubSubscriptionPackagesApi";

import { useGetClubSubscriptionTypesQuery } from "../../../../api/endpoints/ClubSubscriptionTypesApi";

interface EditSubscriptionPackageModalProps {
  openEditPackageModal: boolean;
  closeEditClubSubscriptionPackageModal: () => void;
  clubSubscriptionPackageId: number;
}

type FormValues = {
  price: number;
};

const EditSubscriptionPackageModal = (
  props: EditSubscriptionPackageModalProps
) => {
  const {
    openEditPackageModal,
    closeEditClubSubscriptionPackageModal,
    clubSubscriptionPackageId,
  } = props;

  const { user } = useAppSelector((store) => store.user);

  const [updateClubSubscriptionPackage, { data: isSuccess }] =
    useUpdateClubSubscriptionPackageMutation({});

  const {
    data: clubSubscriptionPackages,
    isLoading: isClubSubscriptionPackagesLoading,
    refetch,
  } = useGetClubSubscriptionPackagesQuery({});

  const {
    data: clubSubscriptionTypes,
    isLoading: isClubSubscriptionTypesLoading,
  } = useGetClubSubscriptionTypesQuery({});

  const myPackages = clubSubscriptionPackages?.filter(
    (subscriptionPackage) =>
      subscriptionPackage.club_id === user?.user?.user_id &&
      subscriptionPackage.is_active === true
  );

  const selectedPackage = myPackages?.find(
    (myPackage) =>
      myPackage.club_subscription_package_id === clubSubscriptionPackageId &&
      myPackage.is_active === true
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      price: selectedPackage?.price,
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      const updatedSubscriptionPackageData = {
        club_subscription_package_id: clubSubscriptionPackageId,
        price: Number(formData.price),
        is_active: true,
        club_subscription_type_id: selectedPackage?.club_subscription_type_id,
        club_id: user?.user?.user_id,
      };
      updateClubSubscriptionPackage(updatedSubscriptionPackageData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      reset();
      closeEditClubSubscriptionPackageModal();
    }
  }, [isSuccess]);

  if (
    isClubSubscriptionPackagesLoading ||
    !selectedPackage ||
    isClubSubscriptionTypesLoading
  ) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <Modal
      isOpen={openEditPackageModal}
      onRequestClose={closeEditClubSubscriptionPackageModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1 className={styles.title}>Üyelik Paketi Düzenle</h1>
        <FaWindowClose
          onClick={closeEditClubSubscriptionPackageModal}
          className={styles["close-icon"]}
        />
      </div>
      <p>
        {
          clubSubscriptionTypes?.find(
            (type) =>
              type.club_subscription_type_id ===
              selectedPackage?.club_subscription_type_id
          )?.club_subscription_type_name
        }
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
      >
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>Fiyat (TL)</label>
            <input
              {...register("price", { required: true })}
              type="number"
              min="0"
            />
            {errors.price && (
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
export default EditSubscriptionPackageModal;
