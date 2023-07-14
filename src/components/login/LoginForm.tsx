import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import i18n from "../../common/i18n/i18n";
import styles from "./styles.module.scss";
import paths from "../../routing/Paths";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLoginPlayerMutation } from "../../store/auth/apiSlice";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";

type FormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginPlayer, { data: credentials, isSuccess }] =
    useLoginPlayerMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      await loginPlayer(formData).unwrap();
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        setCredentials({ user: credentials.player, token: credentials.token })
      );
      navigate(paths.HOME);
    }
  }, [isSuccess]);

  return (
    <div className={styles["login-page-container"]}>
      <img className={styles["hero"]} src="/images/hero/court4.jpeg" />
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
              placeholder={i18n.t("loginEmailInputPlaceholder")}
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
            />
            {errors.password && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <button type="submit" className={styles["form-button"]}>
            {i18n.t("loginButtonText")}
          </button>
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
