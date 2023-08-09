import React, { useEffect, useState } from "react";

import ReactModal from "react-modal";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { Player, useGetPlayersQuery } from "../../../api/endpoints/PlayersApi";
import { useUpdatePlayerMutation } from "../../../api/endpoints/PlayersApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";

import { useAppDispatch } from "../../../store/hooks";
import { updatePlayerDetails } from "../../../store/slices/authSlice";

interface UpdateProfileModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  profileData: Player;
}
const UpdateProfileModal = (props: UpdateProfileModalProps) => {
  const { isModalOpen, handleCloseModal, profileData } = props;

  const dispatch = useAppDispatch();

  const [updatePlayer, { isSuccess }] = useUpdatePlayerMutation({});

  const { isLoading: isPlayersLoading, refetch } = useGetPlayersQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Player>({
    defaultValues: {
      fname: profileData?.fname,
      lname: profileData?.lname,
      birth_year: profileData?.birth_year,
      gender: profileData?.gender,
      image: profileData?.image,
      location_id: profileData?.location_id,
      player_level_id: profileData?.player_level_id,
    },
  });

  const [updatedProfile, setUpdatedProfile] = useState(null);

  const onSubmit: SubmitHandler<Player> = (formData) => {
    const updatedProfileData = {
      player_id: profileData?.player_id,
      fname: formData?.fname,
      lname: formData?.lname,
      birth_year: formData?.birth_year,
      gender: formData?.gender,
      phone_number: null,
      image: null,
      player_bio_description: null,
      location_id: Number(formData?.location_id),
      player_level_id: Number(formData?.player_level_id),
      user_id: profileData?.user_id,
    };
    updatePlayer(updatedProfileData);
    setUpdatedProfile(updatedProfileData);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(updatePlayerDetails(updatedProfile));
      refetch();
      reset(updatedProfile);
      handleCloseModal();
    }
  }, [isSuccess]);

  if (isLocationsLoading || isPlayerLevelsLoading || isPlayersLoading) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={handleCloseModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1>Profil Düzenle</h1>
        <img
          src="/images/icons/close.png"
          onClick={handleCloseModal}
          className={styles["close-button"]}
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-container"]}
      >
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>İsim</label>
            <input {...register("fname", { required: true })} type="text" />
            {errors.fname && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Soyisim</label>
            <input {...register("lname", { required: true })} type="text" />
            {errors.lname && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>Cinsiyet</label>
            <select {...register("gender", { required: true })}>
              <option value="">-- Seçim yapın --</option>
              <option value="female">Kadın</option>
              <option value="male">Erkek</option>
            </select>
            {errors.gender && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Doğum Yılı</label>
            <input
              {...register("birth_year", {
                required: "Bu alan zorunludur",
                min: {
                  value: 1900,
                  message: "Girdiğiniz tarihi kontrol edin",
                },
                max: {
                  value: 2023,
                  message: "Girdiğiniz tarihi kontrol edin",
                },
              })}
              type="number"
            />
            {errors.birth_year && (
              <span className={styles["error-field"]}>
                {errors.birth_year.message}
              </span>
            )}
          </div>
        </div>
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>Seviye</label>
            <select {...register("player_level_id", { required: true })}>
              <option value="">-- Seçim yapın --</option>
              {playerLevels?.map((playerLevel) => (
                <option
                  key={playerLevel.player_level_id}
                  value={playerLevel.player_level_id}
                >
                  {playerLevel.player_level_name}
                </option>
              ))}
            </select>
            {errors.player_level_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Konum</label>
            <select {...register("location_id", { required: true })}>
              <option value="">-- Seçim yapın --</option>
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
        </div>
        <button type="submit" className={styles["form-button"]}>
          Onayla
        </button>
      </form>
    </ReactModal>
  );
};

export default UpdateProfileModal;
