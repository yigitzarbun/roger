import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import styles from "./styles.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import paths from "../../../routing/Paths";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useAddUserMutation,
  useGetUsersQuery,
} from "../../../store/auth/apiSlice";
import {
  useAddTrainerMutation,
  useGetTrainersQuery,
} from "../../../../api/endpoints/TrainersApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetTrainerEmploymentTypesQuery } from "../../../../api/endpoints/TrainerEmploymentTypesApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetUserTypesQuery } from "../../../../api/endpoints/UserTypesApi";
import { useGetUserStatusTypesQuery } from "../../../../api/endpoints/UserStatusTypesApi";
import {
  useAddClubStaffMutation,
  useGetClubStaffQuery,
} from "../../../../api/endpoints/ClubStaffApi";

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
  repeat_password;
};
interface TrainerRegisterProps {
  setUserType: Dispatch<SetStateAction<string>>;
}
const TrainerRegisterForm = (props: TrainerRegisterProps) => {
  const { setUserType } = props;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const userLanguagePreference = localStorage.getItem("tennis_app_language");
  const broswerLanguage = navigator.language;
  const browserLanguageConverted =
    broswerLanguage === "en-GB"
      ? "en"
      : broswerLanguage === "tr-TR"
      ? "tr"
      : "tr";

  const languageString = userLanguagePreference
    ? userLanguagePreference
    : browserLanguageConverted
    ? browserLanguageConverted
    : "tr";

  const languageId =
    languageString === "tr" ? 1 : languageString === "en" ? 2 : 1;

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

  const { refetch: refetchUsers } = useGetUsersQuery({});

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
    getValues,
    trigger,
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
      language_id: languageId,
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
        await addTrainer(trainerRegisterData);
        // register trainer as club staff, if applicable
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

  const [page, setPage] = useState(1);

  const handlePage = async (direction: string) => {
    if (direction === "next" && page === 1) {
      const result = await trigger();
      if (result) {
        setPage(page + 1);
      }
    } else if (direction === "next" && page === 2) {
      const result = await trigger();
      if (result) {
        setPage(page + 1);
      }
    } else if (direction === "prev" && page !== 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    if (isAddTrainerSuccess) {
      toast.success("Kayıt başarılı");
      refetchUsers();
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
      <img className={styles["hero"]} src="/images/hero/coach_hero.jpeg" />
      <div className={styles["register-form-content"]}>
        <h1 className={styles["register-title"]}>{t("registerTrainer")}</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
          encType="multipart/form-data"
        >
          {(errors.fname ||
            errors.lname ||
            errors.gender ||
            errors.birth_year ||
            errors.trainer_experience_type_id ||
            errors.location_id ||
            errors.email ||
            errors.password ||
            errors.trainer_employment_type_id ||
            errors.repeat_password) && (
            <span className={styles["error-field"]}>
              Tüm alanları doldurduğunuzdan emin olun
            </span>
          )}
          {page === 1 && (
            <div className={styles["page-container"]}>
              <div className={styles["input-outer-container"]}>
                <div className={styles["input-container"]}>
                  <label>{t("tableNameHeader")}</label>
                  <input
                    {...register("fname", { required: true })}
                    type="text"
                    placeholder={t("registerFNamelInputPlaceholder")}
                  />
                </div>
                <div className={styles["input-container"]}>
                  <label>{t("lastName")}</label>
                  <input
                    {...register("lname", { required: true })}
                    type="text"
                    placeholder={t("registerLNamelInputPlaceholder")}
                  />
                </div>
              </div>
              <div className={styles["input-outer-container"]}>
                <div className={styles["input-container"]}>
                  <label>{t("tableGenderHeader")}</label>
                  <select {...register("gender", { required: true })}>
                    <option value="">-- {t("tableGenderHeader")} --</option>
                    <option value="female">{t("female")}</option>
                    <option value="male">{t("male")}</option>
                  </select>
                </div>
                <div className={styles["input-container"]}>
                  <label>{t("birthYear")}</label>
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
                    placeholder={t("registerBirthYearlInputPlaceholder")}
                  />
                </div>
              </div>
            </div>
          )}
          {page === 2 && (
            <div className={styles["page-container"]}>
              <div className={styles["input-outer-container"]}>
                <div className={styles["input-container"]}>
                  <label>{t("tableLevelHeader")}</label>
                  <select
                    {...register("trainer_experience_type_id", {
                      required: true,
                    })}
                  >
                    <option value="">-- {t("tableLevelHeader")} --</option>
                    {trainerExperienceTypes?.map((trainer_experience_type) => (
                      <option
                        key={trainer_experience_type.trainer_experience_type_id}
                        value={
                          trainer_experience_type.trainer_experience_type_id
                        }
                      >
                        {trainer_experience_type?.trainer_experience_type_id ===
                        1
                          ? t("trainerLevelBeginner")
                          : trainer_experience_type?.trainer_experience_type_id ===
                            2
                          ? t("trainerLevelIntermediate")
                          : trainer_experience_type?.trainer_experience_type_id ===
                            3
                          ? t("trainerLevelAdvanced")
                          : t("trainerLevelProfessional")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles["input-container"]}>
                  <label>{t("tableLocationHeader")}</label>
                  <select {...register("location_id", { required: true })}>
                    <option value="">-- {t("tableLocationHeader")} --</option>
                    {locations?.map((location) => (
                      <option
                        key={location.location_id}
                        value={location.location_id}
                      >
                        {location.location_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles["input-outer-container"]}>
                <div className={styles["input-container"]}>
                  <label>{t("trainerEmploymentType")}</label>
                  <select
                    {...register("trainer_employment_type_id", {
                      required: true,
                    })}
                    onChange={handleEmploymentType}
                  >
                    <option value="">-- Seçim yapın --</option>
                    {trainerEmploymentTypes?.map((trainer_employment_type) => (
                      <option
                        key={trainer_employment_type.trainer_employment_type_id}
                        value={
                          trainer_employment_type.trainer_employment_type_id
                        }
                      >
                        {trainer_employment_type.trainer_employment_type_id == 1
                          ? t("independent")
                          : trainer_employment_type.trainer_employment_type_id ==
                            2
                          ? t("privateClub")
                          : t("publicClub")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles["input-container"]}>
                  <label>{t("tablePriceHeader")} (TL)</label>
                  <input
                    {...register("price_hour", { required: true })}
                    type="number"
                  />
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
                    <label>{t("tableClubHeader")}</label>
                    <select {...register("club_id", { required: true })}>
                      <option value="">-- {t("tableClubHeader")} --</option>
                      {clubs?.map((club) => (
                        <option key={club.club_id} value={club.club_id}>
                          {club.club_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
          {page === 3 && (
            <div className={styles["page-container"]}>
              <div className={styles["input-outer-container"]}>
                <div className={styles["input-container"]}>
                  <label>
                    <label>{t("loginEmailLabel")}</label>
                  </label>
                  <input
                    {...register("email", { required: true })}
                    type="email"
                  />
                </div>
                <div className={styles["input-container"]}>
                  <label>{t("loginPasswordLabel")}</label>
                  <input
                    {...register("password", { required: true })}
                    type="password"
                  />
                </div>
              </div>
              <div className={styles["input-outer-container"]}>
                <div className={styles["input-container"]}>
                  <label>{t("passwordRepeat")}</label>
                  <input
                    {...register("repeat_password", {
                      required: true,
                      validate: {
                        passEqual: (value) =>
                          value === getValues().password ||
                          "Passwords don't match",
                      },
                    })}
                    type="password"
                  />
                </div>
                <div className={styles["input-container"]}>
                  <label>{t("profilePicture")}</label>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>
          )}
          <div className={styles["buttons-container"]}>
            {page === 1 ? (
              <button
                onClick={() => setUserType("")}
                className={styles["discard-button"]}
                type="button"
              >
                {t("discardButtonText")}
              </button>
            ) : (
              <button
                onClick={() => handlePage("prev")}
                className={styles["discard-button"]}
                type="button"
              >
                {t("return")}
              </button>
            )}
            {page === 3 && Object.keys(errors)?.length === 0 ? (
              <button type="submit" className={styles["submit-button"]}>
                {t("registerButtonText")}
              </button>
            ) : (
              <button
                onClick={() => handlePage("next")}
                className={styles["submit-button"]}
                type="button"
              >
                {t("proceed")}
              </button>
            )}
          </div>
        </form>
        <Link to={paths.LOGIN} className={styles["login-nav"]}>
          {t("loginHaveAccount")}{" "}
          <span className={styles["login-span"]}>{t("loginButtonText")}</span>
        </Link>
      </div>
    </div>
  );
};

export default TrainerRegisterForm;
