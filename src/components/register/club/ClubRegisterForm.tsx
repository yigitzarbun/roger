import React from "react";
import styles from "./styles.module.scss";
import { Link, useNavigate } from "react-router-dom";
import i18n from "../../../common/i18n/i18n";
import paths from "../../../routing/Paths";
import { useForm, SubmitHandler } from "react-hook-form";

import { useAddUserMutation } from "../../../store/auth/apiSlice";

export type FormValues = {
  user_type: string;
  user_status: string;
  email: string;
  password: string;
  club_name: string;
  location: string;
  picture: string;
  address: string;
  club_type: string;
};

const ClubRegisterForm = () => {
  const navigate = useNavigate();
  const [addPlayer] = useAddUserMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    const dataWide = {
      ...formData,
      user_type: "club",
      player_status: "active",
    };
    addPlayer(dataWide);
    navigate(paths.LOGIN);
    reset();
  };

  return (
    <div className={styles["register-page-container"]}>
      <img className={styles["hero"]} src="/images/hero/court3.jpeg" />
      <div className={styles["register-form-content"]}>
        <h1 className={styles["register-title"]}>Kulüp Kayıt</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
        >
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>Kulüp Adı</label>
              <input
                {...register("club_name", { required: true })}
                type="text"
                placeholder="örn. Wimbledon Tennis Club"
              />
              {errors.club_name && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>Kulüp Tipi</label>
              <select {...register("club_type", { required: true })}>
                <option value="">-- Seçim yapın --</option>
                <option value="ataşehir">Özel</option>
                <option value="kadiköy">Devlet / Belediye / Okul</option>
                <option value="maltepe">Site / Rezidans / Konut</option>
              </select>
              {errors.club_type && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
          </div>

          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <label>Konum</label>
              <select {...register("location", { required: true })}>
                <option value="">-- Seçim yapın --</option>
                <option value="ataşehir">Ataşehir</option>
                <option value="kadiköy">Kadıköy</option>
                <option value="maltepe">Maltepe</option>
              </select>
              {errors.location && (
                <span className={styles["error-field"]}>
                  Bu alan zorunludur.
                </span>
              )}
            </div>
            <div className={styles["input-container"]}>
              <label>Adres</label>
              <input {...register("address", { required: true })} type="text" />
              {errors.address && (
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

export default ClubRegisterForm;
