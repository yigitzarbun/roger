import React, { useEffect, useState } from "react";

import ReactModal from "react-modal";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import {
  Club,
  useGetClubsQuery,
  useUpdateClubMutation,
} from "../../../../../api/endpoints/ClubsApi";

import { useAppSelector } from "../../../../../store/hooks";

interface UpdateClubRulesModallProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
}

const UpdateClubRulesModal = (props: UpdateClubRulesModallProps) => {
  const { isModalOpen, handleCloseModal } = props;

  const user = useAppSelector((store) => store?.user?.user?.user);

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
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<Club> = (formData) => {
    let trainerRequired = false;
    let playerRequired = false;

    if (Number(formData.rule_id) === 1) {
      trainerRequired = false;
      playerRequired = false;
    } else if (Number(formData.rule_id) === 2) {
      trainerRequired = false;
      playerRequired = true;
    } else if (Number(formData.rule_id) === 3) {
      trainerRequired = true;
      playerRequired = false;
    } else if (Number(formData.rule_id) === 4) {
      trainerRequired = true;
      playerRequired = true;
    }

    const updatedClubData = {
      ...selectedClub,
      is_trainer_subscription_required: trainerRequired,
      is_player_subscription_required: playerRequired,
    };
    updateClub(updatedClubData);
  };

  useEffect(() => {
    refetch();
    handleCloseModal();
  }, [isSuccess]);
  if (isClubsLoading) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={handleCloseModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>Kuralları Düzenle</h1>
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
            <label>Kort Kiralama Kuralı</label>
            <select {...register("rule_id", { required: true })}>
              <option value="">-- Seçim yapın --</option>
              <option value={1}>
                Eğtimen kulüp çalışanı veya oyuncunun üye olmasına gerek yok
              </option>
              <option value={2}>
                Eğitmen kulüp çalışanı değil, oyuncu üye ise kort kiralanabilir
              </option>
              <option value={3}>
                Eğitmen kulüp çalışanı, oyuncu üye değil ise kort kiralanabilir
              </option>
              <option value={4}>
                Eğitmenin kulüp çalışanı, oyuncunun üye olması zorunludur
              </option>
            </select>
            {errors.rule_id && (
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

export default UpdateClubRulesModal;
