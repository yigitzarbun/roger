import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import styles from "./styles.module.scss";

import { useForm, SubmitHandler } from "react-hook-form";
import { updateTrainerDetails } from "../../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../../store/hooks";
import {
  Trainer,
  useUpdateTrainerMutation,
} from "../../../../../api/endpoints/TrainersApi";

const TrainerImage = (props) => {
  const { trainerDetails, refetchTrainerDetails } = props;
  const dispatch = useAppDispatch();

  const [updateTrainer, { isSuccess }] = useUpdateTrainerMutation({});
  const [updatedProfile, setUpdatedProfile] = useState(null);

  const existingImage = trainerDetails?.image ? trainerDetails?.image : null;

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files[0];
    setValue("image", imageFile);
    if (imageFile) {
      setSelectedImage(imageFile);
    }
  };

  const { handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      image: trainerDetails?.image,
    },
  });

  const onSubmit: SubmitHandler<Trainer> = () => {
    const updatedProfileData = {
      trainer_id: trainerDetails?.trainer_id,
      fname: trainerDetails?.fname,
      lname: trainerDetails?.lname,
      birth_year: trainerDetails?.birth_year,
      gender: trainerDetails?.gender,
      phone_number: null,
      image: selectedImage ? selectedImage : existingImage,
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
      const updatedData = {
        ...updatedProfile,
        image: selectedImage
          ? URL.createObjectURL(selectedImage)
          : existingImage,
      };
      dispatch(updateTrainerDetails(updatedData));
      toast.success("Profil güncellendi");
      refetchTrainerDetails();
      reset(updatedProfile);
      setSelectedImage(null);
    }
  }, [isSuccess]);

  return (
    <div className={styles["trainer-account-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>Profil Resmi</h4>
        <p>Diğer kullanıcıların gördüğü profil resmidir.</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
        encType="multipart/form-data"
      >
        <label htmlFor="fileInput">
          <img
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : trainerDetails?.image || "/images/icons/avatar.jpg"
            }
            alt="trainer-image"
            className={styles["profile-image"]}
            id="preview-image"
          />
        </label>

        <input
          type="file"
          id="fileInput"
          accept="image/*"
          name="image"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <button
          type="submit"
          className={
            selectedImage === null
              ? styles["disabled-button"]
              : styles["active-button"]
          }
          disabled={selectedImage === null}
        >
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default TrainerImage;
