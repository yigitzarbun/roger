import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import styles from "./styles.module.scss";

import { useForm, SubmitHandler } from "react-hook-form";
import { updateTrainerDetails } from "../../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../../store/hooks";
import { useGetLocationsQuery } from "../../../../../api/endpoints/LocationsApi";
import {
  Trainer,
  useUpdateTrainerMutation,
} from "../../../../../api/endpoints/TrainersApi";

const TrainerLocation = (props) => {
  const { trainerDetails, refetchTrainerDetails } = props;
  const { data: locations } = useGetLocationsQuery({});
  const dispatch = useAppDispatch();
  const [updateTrainer, { isSuccess }] = useUpdateTrainerMutation({});
  const [updatedProfile, setUpdatedProfile] = useState(null);
  const [newLocation, setNewLocation] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleLocationChange = (e) => {
    setNewLocation(Number(e.target.value));
  };

  const handleButtonDisabled = () => {
    const isLocationEmpty = !newLocation;

    if (isLocationEmpty || newLocation === trainerDetails?.location_id) {
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
      location_id: Number(trainerDetails?.location_id),
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
      location_id: Number(formData?.location_id),
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
      toast.success("Profil güncellendi");
      refetchTrainerDetails();
      reset(updatedProfile);
      setButtonDisabled(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    handleButtonDisabled();
  }, [newLocation]);
  useEffect(() => {
    // Set default value for location_id when locations data changes
    if (locations && locations.length > 0) {
      setValue("location_id", Number(trainerDetails?.location_id));
    }
  }, [locations, setValue, trainerDetails]);
  return (
    <div className={styles["trainer-account-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>Konum</h4>
        <p>
          Diğer kullanıcılar sizi derse davet ederken bu bilgiyi dikkate
          alabilir.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
        encType="multipart/form-data"
      >
        <div className={styles["input-container"]}>
          <label>Konum</label>
          <select
            {...register("location_id", { required: true })}
            onChange={handleLocationChange}
          >
            {locations?.map((location) => (
              <option key={location.location_id} value={location.location_id}>
                {location.location_name}
              </option>
            ))}
          </select>
          {errors.location_id && (
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

export default TrainerLocation;
