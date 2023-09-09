import React, { useEffect, useState } from "react";

import ReactModal from "react-modal";

import { toast } from "react-toastify";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../../store/hooks";

import {
  Player,
  useGetPlayersQuery,
  useUpdatePlayerMutation,
} from "../../../../../api/endpoints/PlayersApi";

import PageLoading from "../../../../../components/loading/PageLoading";

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

  const [expiryValue, setExpiryValue] = useState("");

  const handleExpiryChange = (event) => {
    const input = event.target;
    let value = input.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    } else if (value.length === 2) {
      value = `${value}/`;
    }

    setExpiryValue(value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<Player> = (formData) => {
    const playerCardDetails = {
      ...selectedPlayer,
      name_on_card: formData?.name_on_card,
      card_number: formData?.card_number,
      cvc: Number(formData?.cvc),
      card_expiry: formData?.card_expiry,
    };
    updatePlayer(playerCardDetails);
  };
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Başarıyla güncellendi");
      handleCloseModal();
    }
  }, [isSuccess]);

  if (isPlayersLoading) {
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
            <label>Kart Üzerindeki İsim Soyisim</label>
            <input
              {...register("name_on_card", { required: true })}
              type="text"
            />
            {errors.name_on_card && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Kart Numarası</label>
            <input
              {...register("card_number", {
                required: "Bu alan zorunludur",
                minLength: 16,
                maxLength: 16,
              })}
            />
            {errors.card_number && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>CVC</label>
            <input
              {...register("cvc", {
                required: true,
                minLength: 3,
                maxLength: 3,
              })}
              type="number"
            />
            {errors.cvc && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Son Kullanma Tarihi</label>
            <input
              {...register("card_expiry", {
                required: true,
                minLength: 5,
                maxLength: 5,
              })}
              type="text"
              placeholder="AA/YY"
              value={expiryValue}
              onChange={handleExpiryChange}
            />
            {errors.card_expiry && (
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
