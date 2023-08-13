import React from "react";

import styles from "./styles.module.scss";
import i18n from "../../../../common/i18n/i18n";

const ClubEquip = () => {
  return (
    <div className={styles["club-equip-container"]}>
      <h2>{i18n.t("equipTitle")}</h2>
      <p>{i18n.t("equipText")}</p>
      <a href="https://www.spx.com.tr/sporlar-tenis/" target="_blank">
        <button>{i18n.t("equipButtonText")}</button>
      </a>
    </div>
  );
};

export default ClubEquip;
