import React, { useEffect, useState, ChangeEventHandler } from "react";

import ReactModal from "react-modal";

import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./styles.module.scss";

import {
  Trainer,
  useGetTrainersQuery,
  useUpdateTrainerMutation,
} from "../../../../api/endpoints/TrainersApi";

import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetTrainerEmploymentTypesQuery } from "../../../../api/endpoints/TrainerEmploymentTypesApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";

import { useAppDispatch } from "../../../../store/hooks";
import { updateTrainerDetails } from "../../../../store/slices/authSlice";

interface UpdateTrainerProfileModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  profileData: Trainer;
}
const UpdateTrainerProfileModal = (props: UpdateTrainerProfileModalProps) => {
  const { isModalOpen, handleCloseModal, profileData } = props;

  const dispatch = useAppDispatch();

  const [updateTrainer, { isSuccess }] = useUpdateTrainerMutation({});

  const { isLoading: isTrainersLoading, refetch } = useGetTrainersQuery({});

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const {
    data: trainerEmploymentTypes,
    isLoading: isTrainerEmploymentTypesLoading,
  } = useGetTrainerEmploymentTypesQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const [selectedEmploymentType, setSelectedEmploymentType] = useState(null);
  const handleSelectedEmploymentType: ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    const selectedValue: number = parseInt(event.target.value, 10);
    setSelectedEmploymentType(selectedValue);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Trainer>({
    defaultValues: {
      fname: profileData?.fname,
      lname: profileData?.lname,
      birth_year: profileData?.birth_year,
      gender: profileData?.gender,
      image: profileData?.image,
      location_id: profileData?.location_id,
      trainer_employment_type_id: profileData?.trainer_employment_type_id,
      trainer_experience_type_id: profileData?.trainer_experience_type_id,
      club_id: profileData?.club_id,
      price_hour: profileData?.price_hour,
    },
  });

  const [updatedProfile, setUpdatedProfile] = useState(null);

  const onSubmit: SubmitHandler<Trainer> = (formData) => {
    const updatedProfileData = {
      trainer_id: profileData?.trainer_id,
      fname: formData?.fname,
      lname: formData?.lname,
      birth_year: formData?.birth_year,
      gender: formData?.gender,
      phone_number: null,
      image: null,
      trainer_bio_description: null,
      location_id: Number(formData?.location_id),
      club_id: Number(formData?.club_id),
      price_hour: Number(formData?.price_hour),
      trainer_employment_type_id: Number(formData?.trainer_employment_type_id),
      trainer_experience_type_id: Number(formData?.trainer_experience_type_id),
      user_id: profileData?.user_id,
    };
    updateTrainer(updatedProfileData);
    setUpdatedProfile(updatedProfileData);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(updateTrainerDetails(updatedProfile));
      refetch();
      reset(updatedProfile);
      handleCloseModal();
    }
  }, [isSuccess]);

  if (
    isLocationsLoading ||
    isTrainersLoading ||
    isClubsLoading ||
    isTrainerEmploymentTypesLoading ||
    isTrainerExperienceTypesLoading
  ) {
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
        </div>
        <div className={styles["input-outer-container"]}>
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
            <label>Ücret (TL / saat)</label>
            <input
              {...register("price_hour", { required: true })}
              type="number"
            />
            {errors.price_hour && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
        </div>
        <div className={styles["input-outer-container"]}>
          <div className={styles["input-container"]}>
            <label>Tecrübe</label>
            <select
              {...register("trainer_experience_type_id", { required: true })}
            >
              <option value="">-- Seçim yapın --</option>
              {trainerExperienceTypes?.map((type) => (
                <option
                  key={type.trainer_experience_type_id}
                  value={type.trainer_experience_type_id}
                >
                  {type.trainer_experience_type_name}
                </option>
              ))}
            </select>
            {errors.trainer_experience_type_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Çalışma Şekli</label>
            <select
              {...register("trainer_employment_type_id", { required: true })}
              onChange={handleSelectedEmploymentType}
            >
              <option value="">-- Seçim yapın --</option>
              {trainerEmploymentTypes?.map((type) => (
                <option
                  key={type.trainer_employment_type_id}
                  value={type.trainer_employment_type_id}
                >
                  {type.trainer_employment_type_name}
                </option>
              ))}
            </select>
            {errors.trainer_employment_type_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Kulüp</label>
            <select
              {...register("club_id", { required: true })}
              disabled={
                selectedEmploymentType !== 2 && selectedEmploymentType !== 3
              }
            >
              <option value="">-- Seçim yapın --</option>
              {clubs?.map((club) => (
                <option key={club.club_id} value={club.club_id}>
                  {club.club_name}
                </option>
              ))}
            </select>
            {errors.trainer_experience_type_id && (
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

export default UpdateTrainerProfileModal;
