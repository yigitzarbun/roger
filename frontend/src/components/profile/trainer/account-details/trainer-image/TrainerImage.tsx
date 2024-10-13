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
import { imageUrl } from "../../../../../common/constants/apiConstants";

const TrainerImage = (props) => {
  const { trainerDetails, refetchTrainerDetails } = props;

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const [updateTrainer, { isSuccess }] = useUpdateTrainerMutation({});

  const [updatedProfile, setUpdatedProfile] = useState(null);

  const existingImage = trainerDetails?.trainerImage || null;

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      image: existingImage,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0] || null; // Get the first file or null
    setValue("image", imageFile);
    if (imageFile) {
      setSelectedImage(imageFile); // Update state
    }
  };

  const onSubmit: SubmitHandler<any> = () => {
    const updatedProfileData = {
      trainer_id: trainerDetails?.trainer_id,
      fname: trainerDetails?.fname,
      lname: trainerDetails?.lname,
      birth_year: trainerDetails?.birth_year,
      gender: trainerDetails?.gender,
      phone_number: null,
      image: selectedImage || existingImage,
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
      const updatedData = {
        ...updatedProfile,
        image: selectedImage
          ? `${imageUrl}/Uploads/${selectedImage.name}`
          : existingImage,
      };
      dispatch(updateTrainerDetails(updatedData));
      toast.success("Profil güncellendi");
      refetchTrainerDetails();
      reset({ image: null }); // Reset the form
      setSelectedImage(null); // Clear the selected image
    }
  }, [
    isSuccess,
    updatedProfile,
    existingImage,
    dispatch,
    refetchTrainerDetails,
    reset,
  ]);

  const imagePreviewUrl = selectedImage
    ? URL.createObjectURL(selectedImage)
    : existingImage
    ? `${imageUrl}/${existingImage}`
    : "/images/icons/avatar.jpg";

  return (
    <div className={styles["trainer-account-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>{t("profilePicture")}</h4>
        <p>{t("profilePictureText")}</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
        encType="multipart/form-data"
      >
        <label htmlFor="fileInput">
          <img
            src={imagePreviewUrl}
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
          {t("save")}
        </button>
      </form>
    </div>
  );
};

export default TrainerImage;
