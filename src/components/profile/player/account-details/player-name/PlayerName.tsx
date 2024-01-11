import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import styles from "./styles.module.scss";

import { useUpdatePlayerMutation } from "../../../../../api/endpoints/PlayersApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { Player } from "../../../../../api/endpoints/PlayersApi";
import { updatePlayerDetails } from "../../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../../store/hooks";

const PlayerName = (props) => {
  const { playerDetails, refetchPlayerDetails } = props;
  const dispatch = useAppDispatch();

  const [updatePlayer, { isSuccess }] = useUpdatePlayerMutation({});
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
      (newFname === playerDetails?.[0]?.fname &&
        newLname === playerDetails?.[0]?.lname)
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
      fname: playerDetails?.[0]?.fname,
      lname: playerDetails?.[0]?.lname,
    },
  });

  const onSubmit: SubmitHandler<Player> = (formData) => {
    const updatedProfileData = {
      player_id: playerDetails?.[0]?.player_id,
      fname: formData?.fname,
      lname: formData?.lname,
      birth_year: playerDetails?.[0]?.birth_year,
      gender: playerDetails?.[0]?.gender,
      phone_number: null,
      image: playerDetails?.[0]?.image,
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
      dispatch(updatePlayerDetails(updatedProfile));
      toast.success("Profil güncellendi");
      refetchPlayerDetails();
      reset(updatedProfile);
    }
  }, [isSuccess]);

  useEffect(() => {
    handleButtonDisabled();
  }, [newFname, newLname]);

  return (
    <div className={styles["player-account-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>Oyuncu Adı</h4>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
        encType="multipart/form-data"
      >
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>İsim</label>
            <input
              {...register("fname", { required: true })}
              type="text"
              onChange={handleFnameChange}
            />
            {errors.fname && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Soyisim</label>
            <input
              {...register("lname", { required: true })}
              type="text"
              onChange={handleLnameChange}
            />
            {errors.lname && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
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
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default PlayerName;
