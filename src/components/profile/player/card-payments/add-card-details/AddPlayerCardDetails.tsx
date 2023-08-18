import React, { useEffect } from "react";

import ReactModal from "react-modal";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../../store/hooks";

import {
  Player,
  useGetPlayersQuery,
  useUpdatePlayerMutation,
} from "../../../../../api/endpoints/PlayersApi";

interface AddPlayerCardDetailsModallProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
}

const AddPlayerCardDetails = (props: AddPlayerCardDetailsModallProps) => {
  const { isModalOpen, handleCloseModal } = props;

  const user = useAppSelector((store) => store?.user?.user?.user);

  const {
    data: players,
    isLoading: isPlayersLoading,
    refetch,
  } = useGetPlayersQuery({});

  const selectedPlayer = players?.find(
    (player) => player.user_id === user?.user_id
  );

  const [updatePlayer, { isSuccess }] = useUpdatePlayerMutation({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<Player> = (formData) => {
    const playerCardDetails = {
      ...selectedPlayer,
      name_on_card: formData?.name_on_card,
      card_number: Number(formData?.card_number),
      cvc: Number(formData?.cvc),
      card_expiry: formData?.card_expiry,
    };
    updatePlayer(playerCardDetails);
  };
  useEffect(() => {
    if (isSuccess) {
      refetch();
      reset();
      handleCloseModal();
    }
  }, [isSuccess]);

  if (isPlayersLoading) {
    return <div>Yükleniyor..</div>;
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
        </div>
        <button type="submit" className={styles["form-button"]}>
          Onayla
        </button>
      </form>
    </ReactModal>
  );
};

export default AddPlayerCardDetails;
