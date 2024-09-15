import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import styles from "./styles.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import paths from "../../../routing/Paths";
import { useForm, SubmitHandler } from "react-hook-form";

import {
  useAddUserMutation,
  useGetUsersQuery,
} from "../../../store/auth/apiSlice";
import {
  useAddClubMutation,
  useGetClubsQuery,
} from "../../../api/endpoints/ClubsApi";
import { useGetClubTypesQuery } from "../../../api/endpoints/ClubTypesApi";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetUserTypesQuery } from "../../../api/endpoints/UserTypesApi";
import { useGetUserStatusTypesQuery } from "../../../api/endpoints/UserStatusTypesApi";
import { toast } from "react-toastify";

export type FormValues = {
  user_type_id: number;
  user_status_type_id: number;
  email: string;
  password: string;
  club_name: string;
  location_id: number;
  picture: string;
  club_address: string;
  club_bio_description: string;
  club_type_id: number;
  image?: string;
  repeat_password: string;
};

interface ClubRegisterProps {
  setUserType: Dispatch<SetStateAction<string>>;
}
const ClubRegisterForm = (props: ClubRegisterProps) => {
  const { t } = useTranslation();
  const { setUserType } = props;

  const navigate = useNavigate();
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
  const [addClub, { isSuccess }] = useAddClubMutation();

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});
  const { data: clubTypes, isLoading: isClubTypesLoading } =
    useGetClubTypesQuery({});
  const { data: userTypes, isLoading: isUserTypesLoading } =
    useGetUserTypesQuery({});
  const { data: userStatusTypes, isLoading: isUserStatusTypesLoading } =
    useGetUserStatusTypesQuery({});
  const { refetch: refetchClubs } = useGetClubsQuery({});
  const { refetch: refetchUsers } = useGetUsersQuery({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    // arrange user register data
    const userRegisterData = {
      email: formData.email,
      password: formData.password,
      user_type_id: userTypes?.find((u) => u.user_type_name === "club")
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
        // arrange user register data
        const clubRegisterData = {
          club_name: formData.club_name,
          picture: null,
          club_address: formData.club_address,
          club_bio_description: null,
          club_type_id: formData.club_type_id,
          location_id: Number(formData.location_id),
          image: selectedImage ? selectedImage : null,
          user_id: newUser.user_id,
        };
        // register user
        await addClub(clubRegisterData);
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
    if (isSuccess) {
      refetchUsers();
      refetchClubs();
      toast.success("Kayıt başarılı");
    }
  }, [isSuccess]);

  if (
    isLocationsLoading ||
    isClubTypesLoading ||
    isUserTypesLoading ||
    isUserStatusTypesLoading
  ) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles["register-page-container"]}>
      <img className={styles["hero"]} src="/images/hero/club_hero.jpeg" />
      <div className={styles["register-form-content"]}>
        <h1 className={styles["register-title"]}>{t("registerClub")}</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
          encType="multipart/form-data"
        >
          {(errors.club_name ||
            errors.club_type_id ||
            errors.location_id ||
            errors.club_address ||
            errors.email ||
            errors.password ||
            errors.repeat_password) && (
            <span className={styles["error-field"]}>
              Tüm alanları doldurduğunuzdan emin olun
            </span>
          )}
          {page === 1 && (
            <div className={styles["page-container"]}>
              {" "}
              <div className={styles["input-outer-container"]}>
                <div className={styles["input-container"]}>
                  <label>{t("clubNameHeader")}</label>
                  <input
                    {...register("club_name", { required: true })}
                    type="text"
                    placeholder="örn. Wimbledon Tennis Club"
                  />
                </div>
                <div className={styles["input-container"]}>
                  <label>{t("tableClubTypeHeader")}</label>
                  <select {...register("club_type_id", { required: true })}>
                    <option value="">-- {t("tableClubTypeHeader")} --</option>
                    {clubTypes?.map((club_type) => (
                      <option
                        key={club_type.club_type_id}
                        value={club_type.club_type_id}
                      >
                        {club_type?.club_type_id === 1
                          ? t("clubTypePrivate")
                          : club_type?.club_type_id === 2
                          ? t("clubTypePublic")
                          : t("clubTypeResidential")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles["input-outer-container"]}>
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
                <div className={styles["input-container"]}>
                  <label>{t("address")}</label>
                  <input
                    {...register("club_address", { required: true })}
                    type="text"
                  />
                </div>
              </div>
            </div>
          )}
          {page === 2 && (
            <div className={styles["page-container"]}>
              <div className={styles["input-outer-container"]}>
                <div className={styles["input-container"]}>
                  <label>{t("loginEmailLabel")}</label>
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    placeholder={t("registerEmailInputPlaceholder")}
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
              >
                {t("discardButtonText")}
              </button>
            ) : (
              <button
                onClick={() => handlePage("prev")}
                className={styles["discard-button"]}
              >
                {t("return")}
              </button>
            )}

            {page === 1 ? (
              <button
                onClick={() => handlePage("next")}
                className={styles["submit-button"]}
              >
                {t("proceed")}
              </button>
            ) : page === 2 ? (
              <button
                type="submit"
                className={styles["submit-button"]}
                disabled={Object.keys(errors)?.length > 0}
              >
                {t("registerButtonText")}
              </button>
            ) : (
              ""
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

export default ClubRegisterForm;
