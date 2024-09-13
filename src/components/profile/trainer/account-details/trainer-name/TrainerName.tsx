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
} from "../../../../../api/endpoints/TrainersApi";

const TrainerName = (props) => {
  const { trainerDetails, refetchTrainerDetails } = props;

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const [updateTrainer, { isSuccess }] = useUpdateTrainerMutation({});

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
      (newFname === trainerDetails?.fname && newLname === trainerDetails?.lname)
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
      fname: trainerDetails?.fname,
      lname: trainerDetails?.lname,
    },
  });

  const onSubmit: SubmitHandler<Trainer> = (formData) => {
    const updatedProfileData = {
      trainer_id: trainerDetails?.trainer_id,
      fname: formData?.fname,
      lname: formData?.lname,
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
    }
  }, [isSuccess]);

  useEffect(() => {
    handleButtonDisabled();
  }, [newFname, newLname]);

  return (
    <div className={styles["trainer-account-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>{t("trainerNameTitle")}</h4>
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
                {" "}
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
                {" "}
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

export default TrainerName;
