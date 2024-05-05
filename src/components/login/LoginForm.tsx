import React, { useEffect, useState, ChangeEvent } from "react";

import { useNavigate, Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

import styles from "./styles.module.scss";

import paths from "../../routing/Paths";

import { toast } from "react-toastify";

import { useForm, SubmitHandler } from "react-hook-form";
import { useLoginUserMutation } from "../../store/auth/apiSlice";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";

type FormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginUser, { data: credentials, isSuccess }] = useLoginUserMutation();
  const { t, i18n } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const browserLanguage =
    navigator.language === "en-GB"
      ? "en"
      : navigator.language === "tr-TR"
      ? "tr"
      : "tr";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
        language: browserLanguage,
        theme: "dark",
      };
      await loginUser(loginData).unwrap();
      reset();
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        setCredentials({
          user: credentials.user,
          token: credentials.token,
          language: credentials.language,
          theme: "dark",
        })
      );
      i18n.changeLanguage(browserLanguage);
      toast.success("Giriş başarılı");
      navigate(paths.HOME);
    }
  }, [isSuccess]);

  return (
    <div className={styles["login-page-container"]}>
      <img className={styles["hero"]} src="/images/hero/court5.jpeg" />
      <div className={styles["login-form-content"]}>
        <h1 className={styles["login-title"]}>Giriş</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
        >
          <div className={styles["input-container"]}>
            <label>E-posta</label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder={t("loginEmailInputPlaceholder")}
              onChange={handleEmail}
            />
            {errors.email && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Şifre</label>
            <input
              {...register("password", { required: true })}
              type="password"
              onChange={handlePassword}
            />
            {errors.password && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["buttons-container"]}>
            <button
              type="submit"
              className={
                email !== "" && password !== ""
                  ? styles["active-submit-button"]
                  : styles["passive-submit-button"]
              }
            >
              {t("loginButtonText")}
            </button>
          </div>
        </form>
        <Link to={paths.REGISTER} className={styles["register-nav"]}>
          Hesabın yok mu?{" "}
          <span className={styles["register-span"]}>Kayıt ol</span>
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
