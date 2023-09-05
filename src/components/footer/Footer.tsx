import React from "react";

import { Link } from "react-router-dom";

import { GrInstagram, GrLinkedin } from "react-icons/gr";
import { FaCopyright } from "react-icons/fa";

import styles from "./styles.module.scss";
import paths from "../../routing/Paths";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles["top-container"]}>
        <div className={styles["intro-container"]}>
          <h2>Raket</h2>
          <p>
            Raket, tenis oyuncularının birbirleriyle ve eğitmenlerle
            eşleştirkleri ve doğrudan kort rezervasyonu yaptıkları Türkiye'nin
            ilk tenis platformudur.
          </p>
        </div>
        <div className={styles["navigation-container"]}>
          <nav>
            <div className={styles["left-nav"]}>
              <Link to={paths.EXPLORE}>Keşfet</Link>
              <Link to={paths.TRAIN}>Antreman</Link>
              <Link to={paths.MATCH}>Maç</Link>
              <Link to={paths.LESSON}>Ders</Link>
            </div>
            <div className={styles["left-nav"]}>
              <Link to={paths.CALENDAR}>Takvim</Link>
              <Link to={paths.REQUESTS}>Davetler</Link>
              <Link to={paths.PERFORMANCE}>Performans</Link>
              <Link to={paths.PROFILE}>Profil</Link>
            </div>
          </nav>
        </div>
        <div className={styles["social-container"]}>
          <GrInstagram />
          <GrLinkedin />
        </div>
        <div className={styles["corporate-container"]}>
          <a href="">Hakkında</a>
          <a href="">İletişim</a>
          <a href="">Gizlilik Politikası</a>
          <a href="">Kullanım Şartları</a>
        </div>
      </div>
      <div className={styles["bottom-container"]}>
        <div className={styles["copyright-container"]}>
          <FaCopyright />
          <p>Copyright 2023 Raket. Tüm hakları saklıdır</p>
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
