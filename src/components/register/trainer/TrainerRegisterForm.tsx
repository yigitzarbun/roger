import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Link, useNavigate } from "react-router-dom";
import i18n from "../../../common/i18n/i18n";
import paths from "../../../routing/Paths";
import { useForm, SubmitHandler } from "react-hook-form";

import { useAddUserMutation } from "../../../store/auth/apiSlice";
import {
  useAddTrainerMutation,
  useGetTrainersQuery,
} from "../../../api/endpoints/TrainersApi";
import { useGetTrainerExperienceTypesQuery } from "../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetTrainerEmploymentTypesQuery } from "../../../api/endpoints/TrainerEmploymentTypesApi";
import { useGetClubsQuery } from "../../../api/endpoints/ClubsApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetUserTypesQuery } from "../../../api/endpoints/UserTypesApi";
import { useGetUserStatusTypesQuery } from "../../../api/endpoints/UserStatusTypesApi";
import {
  useAddClubStaffMutation,
  useGetClubStaffQuery,
} from "../../../api/endpoints/ClubStaffApi";

export type FormValues = {
  user_type: number;
  player_status: number;
  email: string;
  password: string;
  fname: string;
  lname: string;
  birth_year: number;
  location_id: number;
  gender: string;
  trainer_experience_type_id: number;
  trainer_employment_type_id: number;
  price_hour: number;
  club_id: number;
  image: string;
};

const TrainerRegisterForm = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setSelectedImage(imageFile);
    setValue("image", imageFile);
  };
  const [employmentType, setEmploymentType] = useState(null);

  const handleEmploymentType = (event) => {
    setEmploymentType(event.target.value);
  };
  const [addUser] = useAddUserMutation();

  const [addTrainer, { isSuccess: isAddTrainerSuccess }] =
    useAddTrainerMutation();

  const { refetch: refetchTrainers } = useGetTrainersQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: userTypes, isLoading: isUserTypesLoading } =
    useGetUserTypesQuery({});

  const { data: userStatusTypes, isLoading: isUserStatusTypesLoading } =
    useGetUserStatusTypesQuery({});

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const {
    data: trainerEmploymentTypes,
    isLoading: isTrainerEmploymentTypesLoading,
  } = useGetTrainerEmploymentTypesQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const [addClubStaff, { isSuccess: isAddClubStaffSuccess }] =
    useAddClubStaffMutation({});

  const { refetch: refetchClubStaff } = useGetClubStaffQuery({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    // arrange user register data
    const userRegisterData = {
      email: formData.email,
      password: formData.password,
      user_type_id: userTypes?.find((u) => u.user_type_name === "trainer")
        .user_type_id,
      user_status_type_id: userStatusTypes?.find(
        (u) => u.user_status_type_name === "active"
      ).user_status_type_id,
    };
    try {
      // register user
      const response = await addUser(userRegisterData);
      if ("data" in response) {
        // get newly added user from db
        const newUser = response.data;
        // arrange trainer register data
        const trainerRegisterData = {
          fname: formData.fname,
          lname: formData.lname,
          birth_year: formData.birth_year,
          gender: formData.gender,
          price_hour: formData.price_hour,
          phone_number: null,
          image: selectedImage ? selectedImage : null,
          trainer_bio_description: null,
          location_id: Number(formData.location_id),
          trainer_experience_type_id: Number(
            formData.trainer_experience_type_id
          ),
          trainer_employment_type_id: Number(
            formData.trainer_employment_type_id
          ),
          club_id: Number(formData.club_id),
          user_id: Number(newUser.user_id),
        };
        // register trainer
        await addTrainer(trainerRegisterData);
        // register trainer as club staff, if applicablenp
        if (Number(formData.trainer_employment_type_id) !== 1) {
          const clubStaffRegisterData = {
            fname: formData.fname,
            lname: formData.lname,
            birth_year: formData.birth_year,
            gender: formData.gender,
            employment_status: "pending",
            gross_salary_month: null,
            iban: null,
            bank_id: null,
            phone_number: null,
            image: null,
            club_id: Number(formData.club_id),
            club_staff_role_type_id: 2,
            user_id: Number(newUser.user_id),
          };
          await addClubStaff(clubStaffRegisterData);
        }
        navigate(paths.LOGIN);
        reset();
      } else {
        console.error("New user data is missing.");
      }
    } catch (error) {
      console.error("Error while adding new user:", error);
    }
  };

  useEffect(() => {
    if (isAddTrainerSuccess) {
      refetchTrainers();
    }
  }, [isAddTrainerSuccess]);

  useEffect(() => {
    if (isAddClubStaffSuccess) {
      refetchClubStaff();
    }
  }, [isAddClubStaffSuccess]);
  if (
    isLocationsLoading ||
    isTrainerExperienceTypesLoading ||
    isUserTypesLoading ||
    isUserStatusTypesLoading ||
    isTrainerEmploymentTypesLoading ||
    isClubsLoading
  ) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles["register-page-container"]}>
      <img className={styles["hero"]} src="/images/hero/court3.jpeg" />
      <div className={styles["register-form-content"]}>
        <h1 className={styles["register-title"]}>Eğitmen Kayıt</h1>
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
                placeholder={i18n.t("registerFNamelInputPlaceholder")}
              />
              {errors.fname && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>Soyisim</label>
              <input
                {...register("lname", { required: true })}
                type="text"
                placeholder={i18n.t("registerLNamelInputPlaceholder")}
              />
              {errors.lname && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
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
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
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
                placeholder={i18n.t("registerBirthYearlInputPlaceholder")}
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
              <label>Tecrübe</label>
              <select
                {...register("trainer_experience_type_id", { required: true })}
              >
                <option value="">-- Seçim yapın --</option>
                {trainerExperienceTypes?.map((trainer_experience_type) => (
                  <option
                    key={trainer_experience_type.trainer_experience_type_id}
                    value={trainer_experience_type.trainer_experience_type_id}
                  >
                    {trainer_experience_type.trainer_experience_type_name}
                  </option>
                ))}
              </select>
              {errors.trainer_experience_type_id && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>Konum</label>
              <select {...register("location_id", { required: true })}>
                <option value="">-- Seçim yapın --</option>
                {locations?.map((location) => (
                  <option
                    key={location.location_id}
                    value={location.location_id}
                  >
                    {location.location_name}
                  </option>
                ))}
              </select>
              {errors.location_id && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>Çalışma Şekli</label>
              <select
                {...register("trainer_employment_type_id", { required: true })}
                onChange={handleEmploymentType}
              >
                <option value="">-- Seçim yapın --</option>
                {trainerEmploymentTypes?.map((trainer_employment_type) => (
                  <option
                    key={trainer_employment_type.trainer_employment_type_id}
                    value={trainer_employment_type.trainer_employment_type_id}
                  >
                    {trainer_employment_type.trainer_employment_type_name}
                  </option>
                ))}
              </select>
              {errors.trainer_employment_type_id && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>Ücret (TL / saat)</label>
              <input
                {...register("price_hour", { required: true })}
                type="number"
              />
              {errors.price_hour && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          </div>
          {(employmentType ==
            trainerEmploymentTypes?.find(
              (t) => t.trainer_employment_type_name === "private_club"
            ).trainer_employment_type_id ||
            employmentType ==
              trainerEmploymentTypes?.find(
                (t) => t.trainer_employment_type_name === "public_club"
              ).trainer_employment_type_id) && (
            <div className={styles["input-outer-container"]}>
              <div className={styles["input-container"]}>
                <label>Kulüp</label>
                <select {...register("club_id", { required: true })}>
                  <option value="">-- Seçim yapın --</option>
                  {clubs?.map((club) => (
                    <option key={club.club_id} value={club.club_id}>
                      {club.club_name}
                    </option>
                  ))}
                </select>
                {errors.club_id && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
            </div>
          )}

          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>E-posta</label>
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder={i18n.t("registerEmailInputPlaceholder")}
              />
              {errors.email && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>Şifre</label>
              <input
                {...register("password", { required: true })}
                type="password"
              />
              {errors.password && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImageChange}
          />
          <button type="submit" className={styles["form-button"]}>
            {i18n.t("registerButtonText")}
          </button>
        </form>
        <Link to={paths.LOGIN} className={styles["login-nav"]}>
          Hesabın var mı?{" "}
          <span className={styles["login-span"]}>Giriş yap</span>
        </Link>
      </div>
    </div>
  );
};

export default TrainerRegisterForm;
