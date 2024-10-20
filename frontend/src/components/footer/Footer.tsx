import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { GrInstagram, GrLinkedin } from "react-icons/gr";
import { FaCopyright } from "react-icons/fa";
import styles from "./styles.module.scss";
import paths from "../../routing/Paths";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.footer}>
      <div className={styles["top-container"]}>
        <div className={styles["intro-container"]}>
          <h2>RaketGo</h2>
          <p>{t("footerText")}</p>
        </div>
        <div className={styles["social-container"]}>
          <GrInstagram />
          <GrLinkedin />
        </div>
        <div className={styles["corporate-container"]}>
          <a href="">{t("about")}</a>
          <a href="">{t("contact")}</a>
          <a href="">{t("privacyPolicy")}</a>
          <a href="">{t("terms")}</a>
        </div>
      </div>
      <div className={styles["bottom-container"]}>
        <div className={styles["copyright-container"]}>
          <FaCopyright />
          <p>Copyright 2023 RaketGo. {t("copyright")}</p>
        </div>
        <a
          href="https://www.decathlon.com.tr/sport/c0-tum-sporlar/c1-tenis/_/N-1iwpi0u"
          target="_blank"
        >
          <img
            src="/images/sponsor/sponsor.png"
            className={styles["sponsor-logo"]}
          />
        </a>
      </div>
    </div>
  );
};

export default Footer;
