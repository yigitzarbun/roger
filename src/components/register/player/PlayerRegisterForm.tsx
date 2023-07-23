import React from "react";
import styles from "./styles.module.scss";
import { Link, useNavigate } from "react-router-dom";
import i18n from "../../../common/i18n/i18n";
import paths from "../../../routing/Paths";
import { useForm, SubmitHandler } from "react-hook-form";

import {
  useAddUserMutation,
  useGetUserByEmailQuery,
} from "../../../store/auth/apiSlice";
import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../api/endpoints/PlayerLevelsApi";
import { useGetUserTypesQuery } from "../../../api/endpoints/UserTypesApi";
import { useGetUserStatusTypesQuery } from "../../../api/endpoints/UserStatusTypesApi";

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
};
interface NewUser {
  user_id: number;
  email: string;
  password: string;
  registered_at: string;
  user_type_id: number;
  user_status_type_id: number;
}
interface AddUserMutationResponse {
  data?: NewUser;
  error?: string;
}

const PlayerRegisterForm = () => {
  const navigate = useNavigate();
  const [addUser] = useAddUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const useFetchUserByEmail = async (
    email: string
  ): Promise<{ data?: NewUser; error?: Error }> => {
    try {
      const { data } = await useGetUserByEmailQuery(email);
      return { data };
    } catch (error) {
      return { error };
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    const userRegisterData = {
      email: formData.email,
      password: formData.password,
      user_type_id: 1,
      user_status_type_id: 1,
    };

    try {
      const response = await addUser(userRegisterData);

      if ("data" in response) {
        const newUser = response.data;
        const playerRegisterData = {
          fname: formData.fname,
          lname: formData.lname,
          birth_year: formData.birth_year,
          gender: formData.gender,
          phone_number: null,
          image: null,
          player_bio_description: null,
          location_id: formData.location_id,
          player_level_id: formData.player_level_id,
          user_id: newUser.user_id,
        };
        // add player
        navigate(paths.LOGIN);
        reset();
      } else {
        console.error("New user data is missing.");
      }
    } catch (error) {
      console.error("Error while adding new user:", error);
    }
  };

  const { data: locations } = useGetLocationsQuery({});
  const { data: playerLevels } = useGetPlayerLevelsQuery({});
  const { data: userTypes } = useGetUserTypesQuery({});
  const { data: userStatusTypes } = useGetUserStatusTypesQuery({});

  return (
    <div className={styles["register-page-container"]}>
      <img className={styles["hero"]} src="/images/hero/court3.jpeg" />
      <div className={styles["register-form-content"]}>
        <h1 className={styles["register-title"]}>Oyuncu Kayıt</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
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
              <label>Seviye</label>
              <select {...register("player_level_id", { required: true })}>
                <option value="">-- Seçim yapın --</option>
                {playerLevels?.map((playerLevel) => (
                  <option key={playerLevel.player_level_id}>
                    {playerLevel.player_level_name}
                  </option>
                ))}
              </select>
              {errors.player_level_id && (
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
                  <option key={location.location_id}>
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

export default PlayerRegisterForm;
