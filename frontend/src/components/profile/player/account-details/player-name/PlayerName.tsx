import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useUpdatePlayerMutation } from "../../../../../../api/endpoints/PlayersApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { Player } from "../../../../../../api/endpoints/PlayersApi";
import { updatePlayerDetails } from "../../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../../store/hooks";

const PlayerName = (props) => {
  const { playerDetails, refetchPlayerDetails } = props;

  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const [updatePlayer, { isSuccess }] = useUpdatePlayerMutation({});

  const [updatedProfile, setUpdatedProfile] = useState(null);

  const [newFname, setNewFname] = useState("");

  const [newLname, setNewLname] = useState("");

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleFnameChange = (e) => {
    setNewFname(e.target.value);
  };

  const handleLnameChange = (e) => {
    setNewLname(e.target.value);
  };

  const handleButtonDisabled = () => {
    const isFnameEmpty = !newFname.trim();
    const isLnameEmpty = !newLname.trim();

    if (
      (isFnameEmpty && isLnameEmpty) ||
      (newFname === playerDetails?.fname && newLname === playerDetails?.lname)
    ) {
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
      fname: playerDetails?.fname,
      lname: playerDetails?.lname,
    },
  });

  const onSubmit: SubmitHandler<Player> = (formData) => {
    const updatedProfileData = {
      player_id: playerDetails?.player_id,
      fname: formData?.fname,
      lname: formData?.lname,
      birth_year: playerDetails?.birth_year,
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
    }
  }, [isSuccess]);

  useEffect(() => {
    handleButtonDisabled();
  }, [newFname, newLname]);

  return (
    <div className={styles["player-account-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>{t("playerName")}</h4>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
        encType="multipart/form-data"
      >
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>{t("firstName")}</label>
            <input
              {...register("fname", { required: true })}
              type="text"
              onChange={handleFnameChange}
            />
            {errors.fname && (
              <span className={styles["error-field"]}>
                {t("mandatoryField")}
              </span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>{t("lastName")}</label>
            <input
              {...register("lname", { required: true })}
              type="text"
              onChange={handleLnameChange}
            />
            {errors.lname && (
              <span className={styles["error-field"]}>
                {t("mandatoryField")}
              </span>
            )}
          </div>
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

export default PlayerName;
