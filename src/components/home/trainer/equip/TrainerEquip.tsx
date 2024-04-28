import React from "react";

import styles from "./styles.module.scss";

import { useTranslation } from "react-i18next";

const TrainerEquip = () => {
  const { t } = useTranslation();

  return (
    <a
      href="https://www.spx.com.tr/sporlar-tenis/"
      target="_blank"
      className={styles["trainer-equip-container"]}
    >
      <h2>{t("equipTitle")}</h2>
      <p>{t("equipText")}</p>
      <a href="https://www.spx.com.tr/sporlar-tenis/" target="_blank">
        <button>{t("equipButtonText")}</button>
      </a>
    </a>
  );
};

export default TrainerEquip;
