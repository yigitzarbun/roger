import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";
import { useUpdateClubMutation } from "../../../../../../api/endpoints/ClubsApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { updateClubDetails } from "../../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../../store/hooks";
import { imageUrl } from "../../../../../common/constants/apiConstants";
import { useTranslation } from "react-i18next";

const ClubImage = (props) => {
  const { clubDetails, refetchClubDetails } = props;

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const [updateClub, { isSuccess }] = useUpdateClubMutation({});

  const [updatedProfile, setUpdatedProfile] = useState(null);

  const existingImage = clubDetails?.[0]?.image || null;

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
      club_id: clubDetails?.[0]?.club_id,
      club_address: clubDetails?.[0]?.club_address,
      club_bio_description: clubDetails?.[0]?.club_bio_description,
      club_name: clubDetails?.[0]?.club_name,
      club_type_id: clubDetails?.[0]?.club_type_id,
      is_trainer_subscription_required:
        clubDetails?.[0]?.is_trainer_subscription_required,
      image: selectedImage || existingImage,
      is_player_lesson_subscription_required:
        clubDetails?.[0]?.is_player_lesson_subscription_required,
      is_player_subscription_required:
        clubDetails?.[0]?.is_player_subscription_required,
      lesson_rule_id: Number(clubDetails?.[0]?.lesson_rule_id),
      player_rule_id: Number(clubDetails?.[0]?.player_rule_id),
      iban: Number(clubDetails?.[0]?.iban),
      bank_id: Number(clubDetails?.[0]?.bank_id),
      name_on_bank_account: String(clubDetails?.[0]?.name_on_bank_account), // Changed to String
      higher_price_for_non_subscribers: Number(
        clubDetails?.[0]?.higher_price_for_non_subscribers
      ),
      location_id: Number(clubDetails?.[0]?.location_id),
      club_level_id: Number(clubDetails?.[0]?.club_level_id),
      user_id: clubDetails?.[0]?.user_id,
    };
    updateClub(updatedProfileData);
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
      dispatch(updateClubDetails(updatedData));
      toast.success("Profil güncellendi");
      refetchClubDetails();
      reset({ image: null }); // Reset form value
      setSelectedImage(null); // Clear selected image
    }
  }, [
    isSuccess,
    updatedProfile,
    existingImage,
    dispatch,
    refetchClubDetails,
    reset,
  ]);

  const imagePreviewUrl = selectedImage
    ? URL.createObjectURL(selectedImage)
    : existingImage
    ? `${imageUrl}/${existingImage}`
    : "/images/icons/avatar.jpg";

  return (
    <div className={styles["club-image-container"]}>
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
            alt="club-image"
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

export default ClubImage;
