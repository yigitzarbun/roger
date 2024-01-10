import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import styles from "./styles.module.scss";

import { useUpdatePlayerMutation } from "../../../../api/endpoints/PlayersApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { Player } from "../../../../api/endpoints/PlayersApi";
import { updatePlayerDetails } from "../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../store/hooks";

const PlayerAccountDetails = (props) => {
  const { playerDetails, refetch } = props;
  const dispatch = useAppDispatch();

  const [updatePlayer, { isSuccess }] = useUpdatePlayerMutation({});
  const [updatedProfile, setUpdatedProfile] = useState(null);

  const existingImage = playerDetails?.[0]?.image
    ? playerDetails?.[0]?.image
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
      image: playerDetails?.[0]?.image,
    },
  });

  const onSubmit: SubmitHandler<Player> = () => {
    const updatedProfileData = {
      player_id: playerDetails?.[0]?.player_id,
      fname: playerDetails?.[0]?.fname,
      lname: playerDetails?.[0]?.lname,
      birth_year: playerDetails?.[0]?.birth_year,
      gender: playerDetails?.[0]?.gender,
      phone_number: null,
      image: selectedImage ? selectedImage : existingImage,
      player_bio_description: null,
      location_id: Number(playerDetails?.[0]?.location_id),
      player_level_id: Number(playerDetails?.[0]?.player_level_id),
      user_id: playerDetails?.[0]?.user_id,
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
      refetch();
      reset(updatedProfile);
      setSelectedImage(null);
    }
  }, [isSuccess]);

  return (
    <div className={styles["player-account-details-container"]}>
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
                : playerDetails?.[0]?.image || "/images/icons/avatar.jpg"
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
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default PlayerAccountDetails;
