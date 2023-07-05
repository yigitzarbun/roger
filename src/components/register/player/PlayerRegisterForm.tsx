import { Link, useNavigate } from "react-router-dom";
import i18n from "../../../common/i18n/i18n";
import styles from "./styles.module.scss";
import paths from "../../../routing/Paths";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
  fname: string;
  lname: string;
  gender: string;
  birth_year: number;
  level: string;
  location: string;
};

const PlayerRegisterForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    console.log(formData);
    navigate(paths.LOGIN);
    reset();
  };

  return (
    <div className={styles["register-page-container"]}>
      <h1 className={styles["register-title"]}>Kayıt</h1>
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
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
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
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
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
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Doğum Yılı</label>
            <input
              {...register("birth_year", {
                required: "Bu alan zorunludur",
                min: { value: 1900, message: "Girdiğiniz tarihi kontrol edin" },
                max: { value: 2023, message: "Girdiğiniz tarihi kontrol edin" },
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
            <select {...register("level", { required: true })}>
              <option value="">-- Seçim yapın --</option>
              <option value="beginner">Başlangıç</option>
              <option value="intermediate">Orta</option>
              <option value="advanced">İleri</option>
              <option value="professional">Profesyonel</option>
            </select>
            {errors.level && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Konum</label>
            <select {...register("location", { required: true })}>
              <option value="">-- Seçim yapın --</option>
              <option value="ataşehir">Ataşehir</option>
              <option value="kadiköy">Kadıköy</option>
              <option value="maltepe">Maltepe</option>
            </select>
            {errors.location && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
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
        </div>
        <button type="submit" className={styles["form-button"]}>
          {i18n.t("registerButtonText")}
        </button>
      </form>
      <Link to={paths.LOGIN} className={styles["login-nav"]}>
        Hesabın var mı? <span className={styles["login-span"]}>Giriş yap</span>
      </Link>
    </div>
  );
};

export default PlayerRegisterForm;
