import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useUpdatePlayerMutation } from "../../../../../../api/endpoints/PlayersApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { Player } from "../../../../../../api/endpoints/PlayersApi";
import { updatePlayerDetails } from "../../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../../store/hooks";
import { imageUrl } from "../../../../../common/constants/apiConstants";

interface PlayerForm {
  image: File | null;
}

const PlayerImage = (props) => {
  const { playerDetails, refetchPlayerDetails } = props;

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const [updatePlayer, { isSuccess }] = useUpdatePlayerMutation({});

  const [updatedProfile, setUpdatedProfile] = useState(null);

  const existingImage = playerDetails?.image || null;

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { handleSubmit, reset, setValue } = useForm<PlayerForm>({
    defaultValues: {
      image: null,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0] || null;
    setValue("image", imageFile);
    setSelectedImage(imageFile);
  };

  const onSubmit: SubmitHandler<PlayerForm> = () => {
    console.log("Submitting player update");
    const updatedProfileData = {
      player_id: playerDetails?.player_id,
      fname: playerDetails?.fname,
      lname: playerDetails?.lname,
      birth_year: playerDetails?.birth_year,
      gender: playerDetails?.gender,
      phone_number: null,
      image: selectedImage || existingImage,
      player_bio_description: null,
      location_id: Number(playerDetails?.location_id),
      player_level_id: Number(playerDetails?.player_level_id),
      user_id: playerDetails?.user_id,
    };
    console.log("Updated Profile Data: ", updatedProfileData);
    updatePlayer(updatedProfileData);
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
      dispatch(updatePlayerDetails(updatedData));
      toast.success("Profil güncellendi");
      refetchPlayerDetails();
      reset({ image: null });
      setSelectedImage(null);
    }
  }, [
    isSuccess,
    updatedProfile,
    existingImage,
    dispatch,
    refetchPlayerDetails,
    reset,
  ]);

  const imagePreviewUrl = selectedImage
    ? URL.createObjectURL(selectedImage)
    : `${imageUrl}/${existingImage}` || "/images/icons/avatar.jpg";

  return (
    <div className={styles["player-account-details-container"]}>
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
            alt="player-image"
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

export default PlayerImage;
