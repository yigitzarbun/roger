import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import { Player } from "../../../../../api/endpoints/PlayersApi";
import { updateTrainerDetails } from "../../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../../store/hooks";
import { useUpdateTrainerMutation } from "../../../../../api/endpoints/TrainersApi";

const TrainerGender = (props) => {
  const { trainerDetails, refetchTrainerDetails } = props;

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const [updateTrainer, { isSuccess }] = useUpdateTrainerMutation({});

  const [updatedProfile, setUpdatedProfile] = useState(null);

  const [newGender, setNewGender] = useState("");

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleGenderChange = (e) => {
    setNewGender(e.target.value);
  };

  const handleButtonDisabled = () => {
    const isGenderEmpty = !newGender.trim();

    if (isGenderEmpty || newGender === trainerDetails?.trainerGender) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  };
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      gender: trainerDetails?.trainerGender,
    },
  });

  const onSubmit: SubmitHandler<Player> = (formData) => {
    const updatedProfileData = {
      trainer_id: trainerDetails?.trainer_id,
      fname: trainerDetails?.fname,
      lname: trainerDetails?.lname,
      birth_year: trainerDetails?.birth_year,
      gender: formData?.gender,
      phone_number: null,
      image: trainerDetails?.image,
      trainer_bio_description: null,
      location_id: Number(trainerDetails?.location_id),
      club_id: Number(trainerDetails?.club_id),
      price_hour: Number(trainerDetails?.price_hour),
      trainer_employment_type_id: Number(
        trainerDetails?.trainer_employment_type_id
      ),
      trainer_experience_type_id: Number(
        trainerDetails?.trainer_experience_type_id
      ),
      user_id: trainerDetails?.user_id,
    };
    updateTrainer(updatedProfileData);
    setUpdatedProfile(updatedProfileData);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(updateTrainerDetails(updatedProfile));
      setButtonDisabled(true);
      toast.success("Profil güncellendi");
      refetchTrainerDetails();
      reset(updatedProfile);
      setButtonDisabled(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    handleButtonDisabled();
  }, [newGender]);

  useEffect(() => {
    if (trainerDetails) {
      setValue("gender", trainerDetails.trainerGender || "");
    }
  }, [trainerDetails, setValue]);

  return (
    <div className={styles["trainer-account-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>{t("leaderboardTableGenderHeader")}</h4>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
        encType="multipart/form-data"
      >
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>{t("leaderboardTableGenderHeader")}</label>
            <select
              {...register("gender", { required: true })}
              onChange={handleGenderChange}
            >
              <option value="">
                -- {t("leaderboardTableGenderHeader")} --
              </option>
              <option value="female">{t("female")}</option>
              <option value="male">{t("male")}</option>
            </select>
            {errors.gender && (
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

export default TrainerGender;
