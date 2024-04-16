import React, { useEffect } from "react";

import ReactModal from "react-modal";

import { toast } from "react-toastify";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { Bank } from "../../../../../api/endpoints/BanksApi";
import {
  Trainer,
  useUpdateTrainerMutation,
} from "../../../../../api/endpoints/TrainersApi";
import { updateTrainerDetails } from "../../../../../store/slices/authSlice";

interface EditTrainerBankDetailsProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  banks: Bank[];
  trainerDetails: any;
  bankDetailsExist: boolean;
  refetchTrainerDetails: () => void;
}

const EditTrainerBankDetails = (props: EditTrainerBankDetailsProps) => {
  const {
    isModalOpen,
    handleCloseModal,
    banks,
    trainerDetails,
    bankDetailsExist,
    refetchTrainerDetails,
  } = props;

  const [updateTrainer, { data, isSuccess }] = useUpdateTrainerMutation({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      iban: trainerDetails?.iban,
      name_on_bank_account: trainerDetails?.name_on_bank_account,
      bank_id: trainerDetails?.bank_id,
    },
  });

  const onSubmit: SubmitHandler<Trainer> = (formData) => {
    const trainerBankDetails = {
      trainer_id: trainerDetails?.trainer_id,
      fname: trainerDetails?.fname,
      lname: trainerDetails?.lname,
      birth_year: trainerDetails?.birth_year,
      gender: trainerDetails?.gender,
      phone_number: null,
      image: trainerDetails?.image,
      trainer_bio_description: null,
      location_id: Number(trainerDetails?.location_id),
      club_id: Number(trainerDetails?.club_id),
      price_hour: Number(trainerDetails?.price_hour),
      trainer_employment_type_id: Number(
        trainerDetails?.trainer_employment_type_id
      ),
      trainer_experience_type_id: Number(
        trainerDetails?.trainer_experience_type_id
      ),
      user_id: trainerDetails?.user_id,
      iban: formData?.iban,
      name_on_bank_account: formData?.name_on_bank_account,
      bank_id: Number(formData?.bank_id),
    };
    console.log(trainerBankDetails);
    updateTrainer(trainerBankDetails);
  };

  useEffect(() => {
    if (isSuccess && data) {
      handleCloseModal();
      updateTrainerDetails(data);
      refetchTrainerDetails();
      toast.success("Başarıyla güncellendi");
      reset({
        iban: data.iban,
        name_on_bank_account: data.name_on_bank_account,
        bank_id: data.bank_id,
      });
    }
  }, [isSuccess]);

  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={handleCloseModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseModal} />
      <div className={styles["modal-content"]}>
        <h1>
          {bankDetailsExist
            ? "Banla Bilgilerini Düzenle"
            : "Banka Bilgilerini Ekle"}
        </h1>
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
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
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
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          </div>
          <div className={styles["buttons-container"]}>
            <button
              onClick={handleCloseModal}
              className={styles["discard-button"]}
            >
              İptal
            </button>
            <button type="submit" className={styles["delete-button"]}>
              Onayla
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};

export default EditTrainerBankDetails;
