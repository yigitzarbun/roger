import React, { useEffect } from "react";

import Modal from "react-modal";

import { toast } from "react-toastify";

import { FaWindowClose } from "react-icons/fa";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import {
  ClubSubscriptionPackage,
  useGetClubSubscriptionPackagesByFilterQuery,
  useUpdateClubSubscriptionPackageMutation,
} from "../../../../api/endpoints/ClubSubscriptionPackagesApi";

import { ClubSubscriptionTypes } from "../../../../api/endpoints/ClubSubscriptionTypesApi";

interface EditSubscriptionPackageModalProps {
  openEditPackageModal: boolean;
  closeEditClubSubscriptionPackageModal: () => void;
  clubSubscriptionPackageId: number;
  selectedSubscriptionPackage: ClubSubscriptionPackage;
  clubSubscriptionTypes: ClubSubscriptionTypes[];
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
    selectedSubscriptionPackage,
    clubSubscriptionTypes,
  } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const { refetch: refetchMyPackages } =
    useGetClubSubscriptionPackagesByFilterQuery({
      is_active: true,
      club_id: user?.user?.user_id,
    });

  const [
    updateClubSubscriptionPackage,
    { data: updatedClubSubscription, isSuccess },
  ] = useUpdateClubSubscriptionPackageMutation({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      price: selectedSubscriptionPackage?.price,
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      const updatedSubscriptionPackageData = {
        club_subscription_package_id: clubSubscriptionPackageId,
        price: Number(formData.price),
        is_active: true,
        club_subscription_type_id:
          selectedSubscriptionPackage?.club_subscription_type_id,
        club_id: user?.user?.user_id,
      };
      updateClubSubscriptionPackage(updatedSubscriptionPackageData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess && updatedClubSubscription) {
      refetchMyPackages();
      closeEditClubSubscriptionPackageModal();
      toast.success("İşlem başarılı");
      reset({ price: updatedClubSubscription?.price });
    }
  }, [isSuccess]);

  useEffect(() => {
    reset({ price: selectedSubscriptionPackage?.price });
  }, [closeEditClubSubscriptionPackageModal]);

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
      <h3>
        {
          clubSubscriptionTypes?.find(
            (type) =>
              type.club_subscription_type_id ===
              selectedSubscriptionPackage?.club_subscription_type_id
          )?.club_subscription_type_name
        }
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
      >
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>Fiyat (TL)</label>
            <input {...register("price", { required: true })} type="number" />
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
