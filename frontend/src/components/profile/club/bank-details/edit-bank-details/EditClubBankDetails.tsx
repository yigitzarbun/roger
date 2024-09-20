import React, { useEffect } from "react";

import ReactModal from "react-modal";

import { toast } from "react-toastify";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import {
  Club,
  useUpdateClubMutation,
} from "../../../../../../api/endpoints/ClubsApi";

import { Bank } from "../../../../../../api/endpoints/BanksApi";

interface EditClubBankDetailsModallProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  banks: Bank[];
  clubDetails: any;
  bankDetailsExist: boolean;
  refetchClubDetails: () => void;
}

const EditClubBankDetailsModal = (props: EditClubBankDetailsModallProps) => {
  const {
    isModalOpen,
    handleCloseModal,
    banks,
    clubDetails,
    bankDetailsExist,
    refetchClubDetails,
  } = props;

  const [updateClub, { data, isSuccess }] = useUpdateClubMutation({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      iban: clubDetails?.[0]?.iban,
      name_on_bank_account: clubDetails?.[0]?.name_on_bank_account,
      bank_id: clubDetails?.[0]?.bank_id,
    },
  });

  const onSubmit: SubmitHandler<any> = (formData) => {
    const clubBankDetails = {
      club_id: clubDetails?.[0]?.club_id,
      club_address: clubDetails?.[0]?.club_address,
      club_bio_description: clubDetails?.[0]?.club_bio_description,
      club_name: clubDetails?.[0]?.club_name,
      club_type_id: clubDetails?.[0]?.club_type_id,
      is_trainer_subscription_required:
        clubDetails?.[0]?.is_trainer_subscription_required,
      image: clubDetails?.[0]?.image,
      is_player_lesson_subscription_required:
        clubDetails?.[0]?.is_player_lesson_subscription_required,
      is_player_subscription_required:
        clubDetails?.[0]?.is_player_subscription_required,
      lesson_rule_id: Number(clubDetails?.[0]?.lesson_rule_id),
      player_rule_id: Number(clubDetails?.[0]?.player_rule_id),
      higher_price_for_non_subscribers: Number(
        clubDetails?.[0]?.higher_price_for_non_subscribers
      ),
      location_id: Number(clubDetails?.[0]?.location_id),
      club_level_id: Number(clubDetails?.[0]?.club_level_id),
      user_id: clubDetails?.[0]?.user_id,
      iban: formData?.iban,
      name_on_bank_account: formData?.name_on_bank_account,
      bank_id: Number(formData?.bank_id),
    };
    updateClub(clubBankDetails);
  };

  useEffect(() => {
    if (isSuccess && data) {
      handleCloseModal();
      refetchClubDetails();
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
            <button type="submit" className={styles["submit-button"]}>
              Onayla
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};

export default EditClubBankDetailsModal;
