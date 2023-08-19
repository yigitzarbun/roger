import React, { useEffect, useState } from "react";

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

interface EditClubBankDetailsModallProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
}

const EditClubBankDetailsModal = (props: EditClubBankDetailsModallProps) => {
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
  } = useForm({
    defaultValues: {
      iban: selectedClub?.iban,
      name_on_bank_account: selectedClub?.name_on_bank_account,
      bank_id: selectedClub?.bank_id,
    },
  });

  const onSubmit: SubmitHandler<Club> = (formData) => {
    const clubBankDetails = {
      ...selectedClub,
      iban: Number(formData?.iban),
      name_on_bank_account: formData?.name_on_bank_account,
      bank_id: Number(formData?.bank_id),
    };
    updateClub(clubBankDetails);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      handleCloseModal();
    }
  }, [isSuccess]);

  if (isClubsLoading || isBanksLoading) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={handleCloseModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>Banka Hesabını Düzenle</h1>
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
            <input {...register("iban", { required: true })} type="number" />
            {errors.iban && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
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

export default EditClubBankDetailsModal;
