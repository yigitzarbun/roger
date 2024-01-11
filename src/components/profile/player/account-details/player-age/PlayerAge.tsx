import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import styles from "./styles.module.scss";

import { useUpdatePlayerMutation } from "../../../../../api/endpoints/PlayersApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { Player } from "../../../../../api/endpoints/PlayersApi";
import { updatePlayerDetails } from "../../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../../store/hooks";

const PlayerAge = (props) => {
  const { playerDetails, refetchPlayerDetails } = props;
  const dispatch = useAppDispatch();

  const [updatePlayer, { isSuccess }] = useUpdatePlayerMutation({});
  const [updatedProfile, setUpdatedProfile] = useState(null);
  const [newBirthYear, setNewBirthYear] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleBirthYearChange = (e) => {
    setNewBirthYear(e.target.value);
  };

  const handleButtonDisabled = () => {
    const isYearEmpty = !newBirthYear;

    if (isYearEmpty || newBirthYear === playerDetails?.[0]?.birth_year) {
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
      birth_year: playerDetails?.[0]?.birth_year,
    },
  });

  const onSubmit: SubmitHandler<Player> = (formData) => {
    const updatedProfileData = {
      player_id: playerDetails?.[0]?.player_id,
      fname: playerDetails?.[0]?.fname,
      lname: playerDetails?.[0]?.lname,
      birth_year: formData?.birth_year,
      gender: playerDetails?.[0]?.gender,
      phone_number: null,
      image: playerDetails?.[0]?.image,
      player_bio_description: null,
      location_id: Number(playerDetails?.[0]?.location_id),
      player_level_id: Number(playerDetails?.[0]?.player_level_id),
      user_id: playerDetails?.[0]?.user_id,
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
        <h4>Doğum Yılı</h4>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
        encType="multipart/form-data"
      >
        <div className={styles["input-container"]}>
          <label>Doğum Yılı</label>
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
            <span className={styles["error-field"]}>Bu alan zorunludur.</span>
          )}
        </div>
        <button
          type="submit"
          className={
            buttonDisabled ? styles["disabled-button"] : styles["active-button"]
          }
          disabled={buttonDisabled}
        >
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default PlayerAge;
