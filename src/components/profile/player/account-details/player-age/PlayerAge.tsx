import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useUpdatePlayerMutation } from "../../../../../api/endpoints/PlayersApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { Player } from "../../../../../api/endpoints/PlayersApi";
import { updatePlayerDetails } from "../../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../../store/hooks";

const PlayerAge = (props) => {
  const { playerDetails, refetchPlayerDetails } = props;

  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const [updatePlayer, { isSuccess }] = useUpdatePlayerMutation({});

  const [updatedProfile, setUpdatedProfile] = useState(null);

  const [newBirthYear, setNewBirthYear] = useState(null);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleBirthYearChange = (e) => {
    setNewBirthYear(e.target.value);
  };

  const handleButtonDisabled = () => {
    const isYearEmpty = !newBirthYear;

    if (isYearEmpty || newBirthYear === playerDetails?.birth_year) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      birth_year: playerDetails?.birth_year,
    },
  });

  const onSubmit: SubmitHandler<Player> = (formData) => {
    const updatedProfileData = {
      player_id: playerDetails?.player_id,
      fname: playerDetails?.fname,
      lname: playerDetails?.lname,
      birth_year: formData?.birth_year,
      gender: playerDetails?.gender,
      phone_number: null,
      image: playerDetails?.image,
      player_bio_description: null,
      location_id: Number(playerDetails?.location_id),
      player_level_id: Number(playerDetails?.player_level_id),
      user_id: playerDetails?.user_id,
    };
    updatePlayer(updatedProfileData);
    setUpdatedProfile(updatedProfileData);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(updatePlayerDetails(updatedProfile));
      toast.success("Profil güncellendi");
      refetchPlayerDetails();
      reset(updatedProfile);
      setButtonDisabled(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    handleButtonDisabled();
  }, [newBirthYear]);

  return (
    <div className={styles["player-account-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>{t("birthYear")}</h4>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
        encType="multipart/form-data"
      >
        <div className={styles["input-container"]}>
          <label>{t("birthYear")}</label>
          <input
            {...register("birth_year", {
              required: "Bu alan zorunludur",
              min: {
                value: 1900,
                message: "Girdiğiniz tarihi kontrol edin",
              },
              max: {
                value: 2023,
                message: "Girdiğiniz tarihi kontrol edin",
              },
            })}
            type="number"
            onChange={handleBirthYearChange}
          />
          {errors.birth_year && (
            <span className={styles["error-field"]}>{t("mandatoryField")}</span>
          )}
        </div>
        <button
          type="submit"
          className={
            buttonDisabled ? styles["disabled-button"] : styles["active-button"]
          }
          disabled={buttonDisabled}
        >
          {t("save")}
        </button>
      </form>
    </div>
  );
};

export default PlayerAge;
