import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch } from "../../../../../store/hooks";
import { useGetTrainerExperienceTypesQuery } from "../../../../../../api/endpoints/TrainerExperienceTypesApi";
import {
  Trainer,
  useUpdateTrainerMutation,
} from "../../../../../../api/endpoints/TrainersApi";
import { updateTrainerDetails } from "../../../../../store/slices/authSlice";

const TrainerExperience = (props) => {
  const { trainerDetails, refetchTrainerDetails } = props;

  const { t } = useTranslation();

  const { data: trainerExperienceTypes } = useGetTrainerExperienceTypesQuery(
    {}
  );

  const dispatch = useAppDispatch();

  const [updateTrainer, { isSuccess }] = useUpdateTrainerMutation({});

  const [updatedProfile, setUpdatedProfile] = useState(null);

  const [newType, setNewType] = useState(null);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleLevelChange = (e) => {
    setNewType(Number(e.target.value));
  };

  const handleButtonDisabled = () => {
    const isLevelEmpty = !newType;

    if (
      isLevelEmpty ||
      newType === trainerDetails?.trainer_experience_type_id
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
    setValue,
  } = useForm({
    defaultValues: {
      trainer_experience_type_id: Number(
        trainerDetails?.trainer_experience_type_id
      ),
    },
  });
  const onSubmit: SubmitHandler<Trainer> = (formData) => {
    const updatedProfileData = {
      trainer_id: trainerDetails?.trainer_id,
      fname: trainerDetails?.fname,
      lname: trainerDetails?.lname,
      birth_year: trainerDetails?.birth_year,
      gender: trainerDetails?.gender,
      phone_number: null,
      image: trainerDetails?.image,
      trainer_bio_description: null,
      location_id: Number(trainerDetails?.location_id),
      club_id: Number(trainerDetails?.club_id),
      price_hour: Number(trainerDetails?.price_hour),
      trainer_employment_type_id: Number(
        trainerDetails?.trainer_employment_type_id
      ),
      trainer_experience_type_id: Number(formData?.trainer_experience_type_id),
      user_id: trainerDetails?.user_id,
    };
    updateTrainer(updatedProfileData);
    setUpdatedProfile(updatedProfileData);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(updateTrainerDetails(updatedProfile));
      toast.success("Profil güncellendi");
      refetchTrainerDetails();
      reset(updatedProfile);
      setButtonDisabled(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    handleButtonDisabled();
  }, [newType]);

  useEffect(() => {
    if (trainerExperienceTypes && trainerExperienceTypes.length > 0) {
      setValue(
        "trainer_experience_type_id",
        Number(trainerDetails?.trainer_experience_type_id)
      );
    }
  }, [trainerExperienceTypes, setValue, trainerDetails]);
  return (
    <div className={styles["trainer-account-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>{t("leaderboardTableLevelHeader")}</h4>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
        encType="multipart/form-data"
      >
        <div className={styles["input-container"]}>
          <label>{t("leaderboardTableLevelHeader")}</label>
          <select
            {...register("trainer_experience_type_id", { required: true })}
            onChange={handleLevelChange}
          >
            {trainerExperienceTypes?.map((experienceType) => (
              <option
                key={experienceType.trainer_experience_type_id}
                value={experienceType.trainer_experience_type_id}
              >
                {experienceType?.trainer_experience_type_id === 1
                  ? t("trainerLevelBeginner")
                  : experienceType?.trainer_experience_type_id === 2
                  ? t("trainerLevelIntermediate")
                  : experienceType?.trainer_experience_type_id === 3
                  ? t("trainerLevelAdvanced")
                  : t("trainerLevelProfessional")}
              </option>
            ))}
          </select>
          {errors.trainer_experience_type_id && (
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

export default TrainerExperience;
