import React, { useEffect, useState } from "react";

import ReactModal from "react-modal";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import { Club, useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";

import { useUpdateClubMutation } from "../../../../api/endpoints/ClubsApi";
import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetClubTypesQuery } from "../../../../api/endpoints/ClubTypesApi";

import { useAppDispatch } from "../../../../store/hooks";

import { updateClubDetails } from "../../../../store/slices/authSlice";

interface UpdateClubProfileModallProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  profileData: Club;
}
const UpdateClubProfileModall = (props: UpdateClubProfileModallProps) => {
  const { isModalOpen, handleCloseModal, profileData } = props;

  const dispatch = useAppDispatch();

  const [updateClub, { isSuccess }] = useUpdateClubMutation({});

  const { isLoading: isClubsLoading, refetch } = useGetClubsQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: clubTypes, isLoading: isClubTypesLoading } =
    useGetClubTypesQuery({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Club>({
    defaultValues: {
      club_name: profileData?.club_name,
      club_address: profileData?.club_address ? profileData?.club_address : "",
      club_bio_description: profileData?.club_bio_description
        ? profileData?.club_bio_description
        : "",
      location_id: profileData?.location_id,
      club_type_id: profileData?.club_type_id,
    },
  });

  const [updatedProfile, setUpdatedProfile] = useState(null);

  const onSubmit: SubmitHandler<Club> = (formData) => {
    const updatedProfileData = {
      club_id: profileData?.club_id,
      picture: null,
      club_address: formData?.club_address,
      club_bio_description: formData?.club_bio_description,
      club_name: formData?.club_name,
      location_id: Number(formData?.location_id),
      club_type_id: Number(formData?.club_type_id),
      user_id: profileData?.user_id,
    };
    updateClub(updatedProfileData);
    setUpdatedProfile(updatedProfileData);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(updateClubDetails(updatedProfile));
      refetch();
      reset(updatedProfile);
      handleCloseModal();
    }
  }, [isSuccess]);

  if (isLocationsLoading || isClubsLoading || isClubTypesLoading) {
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
            <label>Kulüp Adı</label>
            <input {...register("club_name", { required: true })} type="text" />
            {errors.club_name && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Kulüp Türü</label>
            <select {...register("club_type_id", { required: true })}>
              <option value="">-- Seçim yapın --</option>
              {clubTypes?.map((type) => (
                <option key={type.club_type_id} value={type.club_type_id}>
                  {type.club_type_name}
                </option>
              ))}
            </select>
            {errors.club_type_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <div className={styles["input-outer-container"]}>
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
          <div className={styles["input-container"]}>
            <label>Adres</label>
            <input {...register("club_address")} type="text" />
          </div>
        </div>
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>Açıklama</label>
            <input {...register("club_bio_description")} type="text" />
          </div>
        </div>
        <button type="submit" className={styles["form-button"]}>
          Onayla
        </button>
      </form>
    </ReactModal>
  );
};

export default UpdateClubProfileModall;
