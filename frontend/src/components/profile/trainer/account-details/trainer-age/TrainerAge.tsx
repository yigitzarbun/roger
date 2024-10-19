import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import { updateTrainerDetails } from "../../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../../store/hooks";
import {
  Trainer,
  useUpdateTrainerMutation,
} from "../../../../../../api/endpoints/TrainersApi";

const TrainerAge = (props) => {
  const { trainerDetails, refetchTrainerDetails } = props;

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const [updateTrainer, { isSuccess }] = useUpdateTrainerMutation({});

  const [updatedProfile, setUpdatedProfile] = useState(null);

  const [newBirthYear, setNewBirthYear] = useState(null);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleBirthYearChange = (e) => {
    setNewBirthYear(e.target.value);
  };

  const handleButtonDisabled = () => {
    const isYearEmpty = !newBirthYear;

    if (isYearEmpty || newBirthYear === trainerDetails?.birth_year) {
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
      birth_year: trainerDetails?.trainerBirthYear,
    },
  });

  const onSubmit: SubmitHandler<Trainer> = (formData) => {
    const updatedProfileData = {
      trainer_id: trainerDetails?.trainer_id,
      fname: trainerDetails?.trainerFname,
      lname: trainerDetails?.trainerLname,
      birth_year: formData?.birth_year,
      gender: trainerDetails?.gender,
      phone_number: null,
      image: trainerDetails?.trainerImage,
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
      user_id: trainerDetails?.trainerUserId,
    };
    updateTrainer(updatedProfileData);
    setUpdatedProfile(updatedProfileData);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(updateTrainerDetails(updatedProfile));
      toast.success("Profil güncellendi");
      refetchTrainerDetails();
      setButtonDisabled(true);
      reset(updatedProfile);
    }
  }, [isSuccess]);

  useEffect(() => {
    handleButtonDisabled();
  }, [newBirthYear]);

  return (
    <div className={styles["trainer-account-details-container"]}>
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

export default TrainerAge;
