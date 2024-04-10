import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import styles from "./styles.module.scss";

import { useUpdatePlayerMutation } from "../../../../../api/endpoints/PlayersApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { Player } from "../../../../../api/endpoints/PlayersApi";
import { updatePlayerDetails } from "../../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../../store/hooks";
import { useGetLocationsQuery } from "../../../../../api/endpoints/LocationsApi";

const PlayerLocation = (props) => {
  const { playerDetails, refetchPlayerDetails } = props;
  const { data: locations } = useGetLocationsQuery({});
  const dispatch = useAppDispatch();
  const [updatePlayer, { isSuccess }] = useUpdatePlayerMutation({});
  const [updatedProfile, setUpdatedProfile] = useState(null);
  const [newLocation, setNewLocation] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleLocationChange = (e) => {
    setNewLocation(Number(e.target.value));
  };

  const handleButtonDisabled = () => {
    const isLocationEmpty = !newLocation;

    if (isLocationEmpty || newLocation === playerDetails?.location_id) {
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
      location_id: Number(playerDetails?.location_id),
    },
  });
  const onSubmit: SubmitHandler<Player> = (formData) => {
    const updatedProfileData = {
      player_id: playerDetails?.player_id,
      fname: playerDetails?.fname,
      lname: playerDetails?.lname,
      birth_year: playerDetails?.birth_year,
      gender: playerDetails?.gender,
      phone_number: null,
      image: playerDetails?.image,
      player_bio_description: null,
      location_id: Number(formData?.location_id),
      player_level_id: Number(playerDetails?.player_level_id),
      user_id: playerDetails?.user_id,
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
      setButtonDisabled(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    handleButtonDisabled();
  }, [newLocation]);
  useEffect(() => {
    // Set default value for location_id when locations data changes
    if (locations && locations.length > 0) {
      setValue("location_id", Number(playerDetails?.location_id));
    }
  }, [locations, setValue, playerDetails]);
  return (
    <div className={styles["player-account-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>Konum</h4>
        <p>
          Diğer kullanıcılar sizi antreman, maç veya derse davet ederken bu
          bilgiyi dikkate alabilir.
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

export default PlayerLocation;
