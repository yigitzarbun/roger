import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./styles.module.scss";
import { useUpdatePlayerMutation } from "../../../../../../api/endpoints/PlayersApi";

const AddPlayerCardDetails = (props) => {
  const {
    isModalOpen,
    handleCloseModal,
    playerDetails,
    refetchPlayerDetails,
    cardDetailsExist,
  } = props;

  const { t } = useTranslation();

  const [updatePlayer, { isSuccess }] = useUpdatePlayerMutation({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name_on_card: playerDetails?.name_on_card,
      card_number: playerDetails?.card_number,
      cvc: playerDetails?.cvc,
      card_expiry: playerDetails?.card_expiry,
    },
  });

  useEffect(() => {
    if (isSuccess) {
      refetchPlayerDetails();
      toast.success("Başarıyla güncellendi");
      handleCloseModal();
      reset();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isModalOpen) {
      // Set formatted default values when the modal opens
      if (playerDetails?.card_number) {
        setValue(
          "card_number",
          playerDetails.card_number.replace(/(.{4})/g, "$1 ").trim()
        );
      }
      if (playerDetails?.card_expiry) {
        setValue("card_expiry", playerDetails.card_expiry);
      }
    }
  }, [isModalOpen, playerDetails, setValue]);

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim(); // Format card number
  };

  const formatExpiryDate = (value) => {
    const cleanedValue = value.replace(/\D/g, "");
    if (cleanedValue.length > 4) {
      return `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2, 6)}`;
    } else if (cleanedValue.length > 2) {
      return `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2)}`;
    }
    return cleanedValue;
  };

  const onSubmit: SubmitHandler<any> = (formData) => {
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
      card_number: formData?.card_number.replace(/\s/g, ""), // Remove spaces for the backend
      cvc: Number(formData?.cvc),
      card_expiry: formData?.card_expiry,
    };
    updatePlayer(playerCardDetails);
  };

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
        <h3>{cardDetailsExist ? t("updateCardInformation") : t("addCard")}</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
        >
          <div className={styles["outer-container"]}>
            <div className={styles["input-container"]}>
              <label>{t("nameOnCard")}</label>
              <input
                {...register("name_on_card", { required: true })}
                type="text"
              />
              {errors.name_on_card && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>{t("cardNumber")}</label>
              <input
                {...register("card_number", {
                  required: "Bu alan zorunludur",
                  minLength: 16,
                  maxLength: 19, // accounting for spaces
                })}
                type="text"
                onChange={(e) =>
                  setValue("card_number", formatCardNumber(e.target.value))
                }
              />
              {errors.card_number && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
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
                  {t("mandatoryField")}
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>{t("expiryDate")}</label>
              <input
                {...register("card_expiry", {
                  required: true,
                  minLength: 5,
                  maxLength: 5,
                })}
                type="text"
                placeholder="MM/YY"
                onChange={(e) =>
                  setValue("card_expiry", formatExpiryDate(e.target.value))
                }
              />
              {errors.card_expiry && (
                <span className={styles["error-field"]}>
                  {t("mandatoryField")}
                </span>
              )}
            </div>
          </div>
          <div className={styles["buttons-container"]}>
            <button
              onClick={handleCloseModal}
              className={styles["discard-button"]}
            >
              {t("discardButtonText")}
            </button>
            <button type="submit" className={styles["submit-button"]}>
              {t("submit")}
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};

export default AddPlayerCardDetails;
