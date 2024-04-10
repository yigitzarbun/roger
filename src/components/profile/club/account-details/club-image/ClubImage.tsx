import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import styles from "./styles.module.scss";

import {
  useUpdateClubMutation,
  Club,
} from "../../../../../api/endpoints/ClubsApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { updateClubDetails } from "../../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../../store/hooks";

const ClubImage = (props) => {
  const { clubDetails, refetchclubDetails } = props;
  const dispatch = useAppDispatch();

  const [updateClub, { isSuccess }] = useUpdateClubMutation({});
  const [updatedProfile, setUpdatedProfile] = useState(null);

  const existingImage = clubDetails?.[0]?.image
    ? clubDetails?.[0]?.image
    : null;

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
      image: clubDetails?.[0]?.image,
    },
  });

  const onSubmit: SubmitHandler<Club> = () => {
    const updatedProfileData = {
      club_id: clubDetails?.[0]?.club_id,
      club_address: clubDetails?.[0]?.club_address,
      club_bio_description: clubDetails?.[0]?.club_bio_description,
      club_name: clubDetails?.[0]?.club_name,
      club_type_id: clubDetails?.[0]?.club_type_id,
      is_trainer_subscription_required:
        clubDetails?.[0]?.is_trainer_subscription_required,
      image: selectedImage ? selectedImage : existingImage,
      is_player_lesson_subscription_required:
        clubDetails?.[0]?.is_player_lesson_subscription_required,
      is_player_subscription_required:
        clubDetails?.[0]?.is_player_subscription_required,
      lesson_rule_id: Number(clubDetails?.[0]?.lesson_rule_id),
      player_rule_id: Number(clubDetails?.[0]?.player_rule_id),
      iban: Number(clubDetails?.[0]?.iban),
      bank_id: Number(clubDetails?.[0]?.bank_id),
      name_on_bank_account: Number(clubDetails?.[0]?.name_on_bank_account),
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
          ? URL.createObjectURL(selectedImage)
          : existingImage,
      };
      dispatch(updateClubDetails(updatedData));
      toast.success("Profil güncellendi");
      refetchclubDetails();
      reset(updatedProfile);
      setSelectedImage(null);
    }
  }, [isSuccess]);

  return (
    <div className={styles["club-image-container"]}>
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
                : clubDetails?.[0]?.image || "/images/icons/avatar.jpg"
            }
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
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default ClubImage;
