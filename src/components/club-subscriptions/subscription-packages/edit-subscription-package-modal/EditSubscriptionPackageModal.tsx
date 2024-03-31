import React, { useEffect } from "react";

import ReactModal from "react-modal";

import { toast } from "react-toastify";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import {
  useGetClubSubscriptionPackagesByFilterQuery,
  useUpdateClubSubscriptionPackageMutation,
} from "../../../../api/endpoints/ClubSubscriptionPackagesApi";

interface EditSubscriptionPackageModalProps {
  openEditPackageModal: boolean;
  closeEditClubSubscriptionPackageModal: () => void;
  selectedSubscriptionPackage: any;
  user: any;
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
    selectedSubscriptionPackage,
    user,
  } = props;

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
        club_subscription_package_id:
          selectedSubscriptionPackage.club_subscription_package_id,
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
    <ReactModal
      isOpen={openEditPackageModal}
      onRequestClose={closeEditClubSubscriptionPackageModal}
      className={styles["modal-container"]}
      shouldCloseOnOverlayClick={false}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={closeEditClubSubscriptionPackageModal}
      />
      <div className={styles["modal-content"]}>
        <h1 className={styles.title}>Üyelik Paketi Düzenle</h1>
        <h4>{selectedSubscriptionPackage?.club_subscription_type_name}</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
        >
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>Fiyat (TL)</label>
              <input {...register("price", { required: true })} type="number" />
              {errors.price && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          </div>
          <div className={styles["buttons-container"]}>
            <button
              onClick={closeEditClubSubscriptionPackageModal}
              className={styles["discard-button"]}
            >
              İptal
            </button>
            <button type="submit" className={styles["submit-button"]}>
              Tamamla
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};
export default EditSubscriptionPackageModal;
