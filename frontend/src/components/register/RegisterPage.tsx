import React from "react";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import Paths from "../../routing/Paths";
import { SiGoogleplay } from "react-icons/si";
import { FaAppStoreIos } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const RegisterPage = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleNavigate = (path: string) => {
    if (path === "register") {
      navigate(Paths.REGISTER_FORM);
    } else if (path === "login") {
      navigate(Paths.LOGIN);
    }
  };
  return (
    <div className={styles["register-page-container"]}>
      <div className={styles.hero}>
        <div className={styles["intro-container"]}>
          <h1>RaketGo</h1>
          <h3>
            <span className={styles["blue-span"]}>
              {t("registerPageHeroText1")}
            </span>
            <br />
            {t("registerPageHeroText2")}
          </h3>
          <div className={styles["buttons-container"]}>
            <button
              onClick={() => handleNavigate("register")}
              className={styles["register-button"]}
            >
              {t("loginRegisterText")}
            </button>
            <button
              onClick={() => handleNavigate("login")}
              className={styles["login-button"]}
            >
              {t("loginTitle")}
            </button>
          </div>
          <div className={styles["mobile-container"]}>
            <SiGoogleplay className={styles.mobile} />
            <FaAppStoreIos className={styles.mobile} />
          </div>
        </div>
        <img className={styles["hero"]} src="/images/hero/court6.jpeg" />
      </div>

      <div className={styles["register-container"]}>
        <div className={styles["user-types"]}>
          <div
            className={styles["user-type"]}
            onClick={() => handleNavigate("register")}
          >
            <h4>{t("userTypePlayer")}</h4>
            <p>{t("registerPlayerText1")}</p>
            <button>{t("registerPlayer")}</button>
          </div>

          <div
            className={styles["user-type"]}
            onClick={() => handleNavigate("register")}
          >
            <h4>{t("userTypeTrainer")}</h4>
            <p>{t("registerTrainerText1")}</p>
            <button>{t("registerTrainer")}</button>
          </div>

          <div
            className={styles["user-type"]}
            onClick={() => handleNavigate("register")}
          >
            <h4>{t("userTypeClub")}</h4>
            <p>{t("registerClubText1")}</p>
            <button>{t("registerClub")}</button>
          </div>
        </div>
      </div>
      <div>
        <div className={styles["player-container"]}>
          <div className={styles["text-container"]}>
            <h4>{t("userTypePlayer")}</h4>
            <h5>{t("registerPlayerTitle")}</h5>
            <p>{t("registerPlayerText2")}</p>
          </div>
          <img src="/images/hero/hero_landing.png" />
        </div>
        <div className={styles["trainer-container"]}>
          <div className={styles["text-container"]}>
            <h4>{t("userTypeTrainer")}</h4>
            <h5>{t("registerTrainerTitle")}</h5>
            <p>{t("registerTrainerText2")}</p>
          </div>
          <img src="/images/hero/hero_landing2.png" />
        </div>
        <div className={styles["club-container"]}>
          <div className={styles["text-container"]}>
            <h4>{t("userTypeClub")}</h4>
            <h5>{t("registerClubTitle")}</h5>
            <p>{t("registerClubText2")}</p>
          </div>
          <img src="/images/hero/hero_landing3.png" />
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
