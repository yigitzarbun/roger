import React, { useEffect } from "react";

import ReactModal from "react-modal";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../../store/hooks";

import {
  Club,
  useGetClubsQuery,
  useUpdateClubMutation,
} from "../../../../../api/endpoints/ClubsApi";

import { useGetBanksQuery } from "../../../../../api/endpoints/BanksApi";

import PageLoading from "../../../../../components/loading/PageLoading";

interface AddClubBankDetailsModallProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
}

const AddClubBankDetailsModal = (props: AddClubBankDetailsModallProps) => {
  const { isModalOpen, handleCloseModal } = props;

  const user = useAppSelector((store) => store?.user?.user?.user);

  const { data: banks, isLoading: isBanksLoading } = useGetBanksQuery({});

  const {
    data: clubs,
    isLoading: isClubsLoading,
    refetch,
  } = useGetClubsQuery({});

  const selectedClub = clubs?.find((club) => club.user_id === user?.user_id);

  const [updateClub, { isSuccess }] = useUpdateClubMutation({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<Club> = (formData) => {
    const clubBankDetails = {
      ...selectedClub,
      iban: formData?.iban,
      name_on_bank_account: formData?.name_on_bank_account,
      bank_id: Number(formData?.bank_id),
    };
    updateClub(clubBankDetails);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      reset();
      handleCloseModal();
    }
  }, [isSuccess]);

  if (isClubsLoading || isBanksLoading) {
    return <PageLoading />;
  }
  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={handleCloseModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>Banka Hesabı Ekle</h1>
        <img
          src="/images/icons/close.png"
          onClick={handleCloseModal}
          className={styles["close-button"]}
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
      >
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>IBAN no</label>
            <input
              {...register("iban", {
                required: "Bu alan zorunludur",
                minLength: {
                  value: 26,
                  message: "Bilgileri doğru girdiğinizden emin olun",
                },
                maxLength: {
                  value: 26,
                  message: "Bilgileri doğru girdiğinizden emin olun",
                },
              })}
              type="number"
            />
            {errors.iban && (
              <span className={styles["error-field"]}>
                Bilgileri eksiksiz ve doğru girdiğinizden emin olun
              </span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Banka Hesap Adı</label>
            <input
              {...register("name_on_bank_account", { required: true })}
              type="text"
            />
            {errors.name_on_bank_account && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Banka</label>
            <select {...register("bank_id")}>
              <option value="">-- Seçim yapın --</option>
              {banks?.map((bank) => (
                <option key={bank.bank_id} value={bank.bank_id}>
                  {bank.bank_name}
                </option>
              ))}
            </select>
            {errors.bank_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <button type="submit" className={styles["form-button"]}>
          Onayla
        </button>
      </form>
    </ReactModal>
  );
};

export default AddClubBankDetailsModal;
