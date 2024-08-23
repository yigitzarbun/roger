import React, { useEffect } from "react";

import ReactModal from "react-modal";

import { toast } from "react-toastify";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import {
  ClubSubscriptionPackage,
  useAddClubSubscriptionPackageMutation,
  useGetClubSubscriptionPackagesByFilterQuery,
} from "../../../../api/endpoints/ClubSubscriptionPackagesApi";

import { ClubSubscriptionTypes } from "../../../../api/endpoints/ClubSubscriptionTypesApi";

interface AddSubscriptionPackageModalProps {
  openAddPackageModal: boolean;
  closeAddClubSubscriptionPackageModal: () => void;
  clubSubscriptionTypes: ClubSubscriptionTypes[];
  myPackages: ClubSubscriptionPackage[];
  user: any;
  currentClub: any;
}

type FormValues = {
  price: number;
  club_subscription_type_id: number;
};

const AddSubscriptionPackageModal = (
  props: AddSubscriptionPackageModalProps
) => {
  const {
    openAddPackageModal,
    closeAddClubSubscriptionPackageModal,
    clubSubscriptionTypes,
    myPackages,
    user,
    currentClub,
  } = props;

  const { refetch: refetchMyPackages } =
    useGetClubSubscriptionPackagesByFilterQuery({
      is_active: true,
      club_id: user?.user?.user_id,
    });

  const clubBankDetailsExist =
    currentClub?.[0]?.iban &&
    currentClub?.[0]?.bank_id &&
    currentClub?.[0]?.name_on_bank_account;

  const [addClubSubscriptionPackage, { isSuccess }] =
    useAddClubSubscriptionPackageMutation({});

  const myPackageTypes = [];
  myPackages?.forEach((myPackage) =>
    myPackageTypes.push(myPackage.club_subscription_type_id)
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      const newSubscriptionPackageData = {
        price: Number(formData.price),
        club_subscription_type_id: Number(formData.club_subscription_type_id),
        club_id: user?.user?.user_id,
      };
      if (clubBankDetailsExist) {
        addClubSubscriptionPackage(newSubscriptionPackageData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      refetchMyPackages();
      reset();
      toast.success("Üyelik paketi eklendi");
      closeAddClubSubscriptionPackageModal();
    }
  }, [isSuccess]);

  return (
    <ReactModal
      isOpen={openAddPackageModal}
      onRequestClose={closeAddClubSubscriptionPackageModal}
      className={styles["modal-container"]}
      shouldCloseOnOverlayClick={false}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={closeAddClubSubscriptionPackageModal}
      />
      <div className={styles["modal-content"]}>
        <h1 className={styles.title}>Üyelik Paketi Ekle</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
        >
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>Üyelik Türü</label>
              <select
                {...register("club_subscription_type_id", { required: true })}
              >
                <option value="">-- Üyelik Türü --</option>
                {clubSubscriptionTypes
                  ?.filter(
                    (type) =>
                      !myPackageTypes.includes(type.club_subscription_type_id)
                  )
                  ?.map((type) => (
                    <option
                      key={type.club_subscription_type_id}
                      value={type.club_subscription_type_id}
                    >
                      {type.club_subscription_type_name}
                    </option>
                  ))}
              </select>
              {errors.club_subscription_type_id && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>Fiyat (TL)</label>
              <input
                {...register("price", { required: true })}
                type="number"
                min="0"
              />
              {errors.price && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          </div>
          <div className={styles["buttons-container"]}>
            <button
              onClick={closeAddClubSubscriptionPackageModal}
              className={styles["discard-button"]}
            >
              İptal
            </button>
            <button
              type="submit"
              className={styles["submit-button"]}
              disabled={!clubBankDetailsExist}
            >
              {clubBankDetailsExist
                ? "Tamamla"
                : "Banka Hesap Bilgilerinizi Ekleyin"}
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};
export default AddSubscriptionPackageModal;
