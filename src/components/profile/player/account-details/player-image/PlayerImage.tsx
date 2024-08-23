import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useUpdatePlayerMutation } from "../../../../../api/endpoints/PlayersApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { Player } from "../../../../../api/endpoints/PlayersApi";
import { updatePlayerDetails } from "../../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../../store/hooks";

const PlayerImage = (props) => {
  const { playerDetails, refetchPlayerDetails } = props;

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const [updatePlayer, { isSuccess }] = useUpdatePlayerMutation({});

  const [updatedProfile, setUpdatedProfile] = useState(null);

  const existingImage = playerDetails?.image ? playerDetails?.image : null;

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
      image: playerDetails?.image,
    },
  });

  const onSubmit: SubmitHandler<Player> = () => {
    const updatedProfileData = {
      player_id: playerDetails?.player_id,
      fname: playerDetails?.fname,
      lname: playerDetails?.lname,
      birth_year: playerDetails?.birth_year,
      gender: playerDetails?.gender,
      phone_number: null,
      image: selectedImage ? selectedImage : existingImage,
      player_bio_description: null,
      location_id: Number(playerDetails?.location_id),
      player_level_id: Number(playerDetails?.player_level_id),
      user_id: playerDetails?.user_id,
    };
    updatePlayer(updatedProfileData);
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
      dispatch(updatePlayerDetails(updatedData));
      toast.success("Profil güncellendi");
      refetchPlayerDetails();
      reset(updatedProfile);
      setSelectedImage(null);
    }
  }, [isSuccess]);

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
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : playerDetails?.image || "/images/icons/avatar.jpg"
            }
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
