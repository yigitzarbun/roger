import React, { useEffect } from "react";

import Modal from "react-modal";

import { toast } from "react-toastify";

import { FaWindowClose } from "react-icons/fa";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";

import {
  ClubSubscriptionPackage,
  useAddClubSubscriptionPackageMutation,
  useGetClubSubscriptionPackagesByFilterQuery,
} from "../../../../api/endpoints/ClubSubscriptionPackagesApi";

import { useGetClubByClubIdQuery } from "../../../../api/endpoints/ClubsApi";

import { ClubSubscriptionTypes } from "../../../../api/endpoints/ClubSubscriptionTypesApi";
import PageLoading from "../../../../components/loading/PageLoading";

interface AddSubscriptionPackageModalProps {
  openAddPackageModal: boolean;
  closeAddClubSubscriptionPackageModal: () => void;
  clubSubscriptionTypes: ClubSubscriptionTypes[];
  myPackages: ClubSubscriptionPackage[];
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
  } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const { data: selectedClub, isLoading: isSelectedClubLoading } =
    useGetClubByClubIdQuery(user?.clubDetails?.club_id);

  const { refetch: refetchMyPackages } =
    useGetClubSubscriptionPackagesByFilterQuery({
      is_active: true,
      club_id: user?.user?.user_id,
    });

  const clubBankDetailsExist =
    selectedClub?.[0]?.iban &&
    selectedClub?.[0]?.bank_id &&
    selectedClub?.[0]?.name_on_bank_account;

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

  if (isSelectedClubLoading) {
    return <PageLoading />;
  }

  return (
    <Modal
      isOpen={openAddPackageModal}
      onRequestClose={closeAddClubSubscriptionPackageModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1 className={styles.title}>Üyelik Paketi Ekle</h1>
        <FaWindowClose
          onClick={closeAddClubSubscriptionPackageModal}
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
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
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
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className={styles["form-button"]}
          disabled={!clubBankDetailsExist}
        >
          {clubBankDetailsExist
            ? "Tamamla"
            : "Banka Hesap Bilgilerinizi Ekleyin"}
        </button>
      </form>
    </Modal>
  );
};
export default AddSubscriptionPackageModal;
