import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import styles from "./styles.module.scss";
import { Link, useNavigate } from "react-router-dom";
import paths from "../../../routing/Paths";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  useAddUserMutation,
  useGetUsersQuery,
} from "../../../store/auth/apiSlice";
import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";
import { useGetUserTypesQuery } from "../../../../api/endpoints/UserTypesApi";
import { useGetUserStatusTypesQuery } from "../../../../api/endpoints/UserStatusTypesApi";
import {
  useAddPlayerMutation,
  useGetPlayersQuery,
} from "../../../../api/endpoints/PlayersApi";
import { toast } from "react-toastify";

export type FormValues = {
  user_type_id: number;
  user_status_type_id: number;
  email: string;
  password: string;
  fname: string;
  lname: string;
  birth_year: number;
  location_id: number;
  gender: string;
  player_level_id: number;
  image?: string;
  repeat_password: string;
  language_id: number;
};

interface PlayerRegisterProps {
  setUserType: Dispatch<SetStateAction<string>>;
}
const PlayerRegisterForm = (props: PlayerRegisterProps) => {
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

  const [addUser] = useAddUserMutation();

  const [addPlayer, { isSuccess }] = useAddPlayerMutation();

  const { refetch: refetchUsers } = useGetUsersQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const { data: userTypes, isLoading: isUserTypesLoading } =
    useGetUserTypesQuery({});

  const { data: userStatusTypes, isLoading: isUserStatusTypesLoading } =
    useGetUserStatusTypesQuery({});

  const { refetch: refetchPlayers } = useGetPlayersQuery({});

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
    //arrange user register data
    const userRegisterData = {
      email: formData.email,
      password: formData.password,
      user_type_id: userTypes?.find((u) => u.user_type_name === "player")
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

        //arrange player register data
        const playerRegisterData = {
          fname: formData.fname,
          lname: formData.lname,
          birth_year: formData.birth_year.toString(),
          gender: formData.gender,
          phone_number: null,
          image: selectedImage ? selectedImage : null,
          player_bio_description: null,
          location_id: Number(formData.location_id),
          player_level_id: Number(formData.player_level_id),
          user_id: newUser.user_id,
        };

        // register player
        await addPlayer(playerRegisterData);

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
    let result;
    if (direction === "next") {
      if (page === 1) {
        result = await trigger(["fname", "lname", "gender", "birth_year"]);
      } else if (page === 2) {
        result = await trigger([
          "player_level_id",
          "location_id",
          "email",
          "password",
        ]);
      }
      if (result) {
        setPage(page + 1);
      }
    } else if (direction === "prev") {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      refetchUsers();
      refetchPlayers();
      toast.success("Kayıt başarılı");
    }
  }, [isSuccess]);

  if (
    isLocationsLoading ||
    isPlayerLevelsLoading ||
    isUserTypesLoading ||
    isUserStatusTypesLoading
  ) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles["register-page-container"]}>
      <img className={styles["hero"]} src="/images/hero/player_hero.jpg" />
      <div className={styles["register-form-content"]}>
        <h1 className={styles["register-title"]}>{t("registerPlayer")}</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
          encType="multipart/form-data"
        >
          {page === 1 &&
            (errors.fname ||
              errors.lname ||
              errors.gender ||
              errors.birth_year) && (
              <span className={styles["error-field"]}>
                Tüm alanları doldurduğunuzdan emin olun
              </span>
            )}

          {page === 2 &&
            (errors.player_level_id ||
              errors.location_id ||
              errors.email ||
              errors.password) && (
              <span className={styles["error-field"]}>
                Tüm alanları doldurduğunuzdan emin olun
              </span>
            )}

          {page === 3 && errors.repeat_password && (
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
                  {errors.fname && <span>{errors.fname.message}</span>}
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
                  <select {...register("player_level_id", { required: true })}>
                    <option value="">-- {t("tableLevelHeader")} --</option>
                    {playerLevels?.map((playerLevel) => (
                      <option
                        key={playerLevel.player_level_id}
                        value={playerLevel.player_level_id}
                      >
                        {playerLevel?.player_level_id === 1
                          ? t("playerLevelBeginner")
                          : playerLevel?.player_level_id === 2
                          ? t("playerLevelIntermediate")
                          : playerLevel?.player_level_id === 3
                          ? t("playerLevelAdvanced")
                          : t("playerLevelProfessinal")}
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
                  <label>{t("loginEmailLabel")}</label>
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
            </div>
          )}

          {page === 3 && (
            <div className={styles["page-container"]}>
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
            {page === 3 ? (
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

export default PlayerRegisterForm;
