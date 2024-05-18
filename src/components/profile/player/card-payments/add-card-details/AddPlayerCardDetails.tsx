import React, { useEffect, useState } from "react";

import ReactModal from "react-modal";

import { toast } from "react-toastify";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import {
  Player,
  useUpdatePlayerMutation,
} from "../../../../../api/endpoints/PlayersApi";

const AddPlayerCardDetails = (props) => {
  const {
    isModalOpen,
    handleCloseModal,
    playerDetails,
    refetchPlayerDetails,
    cardDetailsExist,
  } = props;

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
    reset,
  } = useForm({
    defaultValues: {
      name_on_card: playerDetails?.name_on_card,
      card_number: playerDetails?.card_number,
      cvc: playerDetails?.cvc,
      card_expiry: playerDetails?.card_expiry,
    },
  });

  const onSubmit: SubmitHandler<Player> = (formData) => {
    const playerCardDetails = {
      player_id: playerDetails?.player_id,
      fname: playerDetails?.fname,
      lname: playerDetails?.lname,
      birth_year: playerDetails?.birth_year,
      gender: playerDetails?.gender,
      location_id: playerDetails?.location_id,
      player_level_id: playerDetails?.player_level_id,
      user_id: playerDetails?.user_id,
      name_on_card: formData?.name_on_card,
      card_number: formData?.card_number,
      cvc: Number(formData?.cvc),
      card_expiry: formData?.card_expiry,
    };
    updatePlayer(playerCardDetails);
  };
  useEffect(() => {
    if (isSuccess) {
      refetchPlayerDetails();
      toast.success("Başarıyla güncellendi");
      handleCloseModal();
      reset();
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
        <h3>
          {cardDetailsExist ? "Kart Bilgilerini Düzenle" : "Yeni Kart Ekle"}
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
        >
          <div className={styles["outer-container"]}>
            <div className={styles["input-container"]}>
              <label>Kart Üzerindeki İsim Soyisim</label>
              <input
                {...register("name_on_card", { required: true })}
                type="text"
              />
              {errors.name_on_card && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
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
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          </div>
          <div className={styles["outer-container"]}>
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
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
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

export default AddPlayerCardDetails;
