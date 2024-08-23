import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useUpdatePlayerMutation } from "../../../../../api/endpoints/PlayersApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { Player } from "../../../../../api/endpoints/PlayersApi";
import { updatePlayerDetails } from "../../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../../store/hooks";
import { useGetPlayerLevelsQuery } from "../../../../../api/endpoints/PlayerLevelsApi";

const PlayerLevel = (props) => {
  const { playerDetails, refetchPlayerDetails } = props;

  const { t } = useTranslation();

  const { data: playerLevels } = useGetPlayerLevelsQuery({});

  const dispatch = useAppDispatch();

  const [updatePlayer, { isSuccess }] = useUpdatePlayerMutation({});

  const [updatedProfile, setUpdatedProfile] = useState(null);

  const [newLevel, setNewLevel] = useState(null);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleLevelChange = (e) => {
    setNewLevel(Number(e.target.value));
  };

  const handleButtonDisabled = () => {
    const isLevelEmpty = !newLevel;

    if (isLevelEmpty || newLevel === playerDetails?.player_level_id) {
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
    setValue,
  } = useForm({
    defaultValues: {
      player_level_id: Number(playerDetails?.player_level_id),
    },
  });
  const onSubmit: SubmitHandler<Player> = (formData) => {
    const updatedProfileData = {
      player_id: playerDetails?.player_id,
      fname: playerDetails?.fname,
      lname: playerDetails?.lname,
      birth_year: playerDetails?.birth_year,
      gender: playerDetails?.gender,
      phone_number: null,
      image: playerDetails?.image,
      player_bio_description: null,
      location_id: playerDetails?.location_id,
      player_level_id: Number(formData?.player_level_id),
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
  }, [newLevel]);
  useEffect(() => {
    if (playerLevels && playerLevels.length > 0) {
      setValue("player_level_id", Number(playerDetails?.player_level_id));
    }
  }, [playerLevels, setValue, playerDetails]);
  return (
    <div className={styles["player-account-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>{t("tableLevelHeader")}</h4>
        <p>{t("levelText")}</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
        encType="multipart/form-data"
      >
        <div className={styles["input-container"]}>
          <label>{t("tableLevelHeader")}</label>
          <select
            {...register("player_level_id", { required: true })}
            onChange={handleLevelChange}
          >
            {playerLevels?.map((level) => (
              <option key={level.player_level_id} value={level.player_level_id}>
                {level.player_level_id === 1
                  ? t("playerLevelBeginner")
                  : level?.player_level_id === 2
                  ? t("playerLevelIntermediate")
                  : level?.player_level_id === 3
                  ? t("playerLevelAdvanced")
                  : t("playerLevelProfessinal")}
              </option>
            ))}
          </select>
          {errors.player_level_id && (
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
          {t("save")}
        </button>
      </form>
    </div>
  );
};

export default PlayerLevel;
