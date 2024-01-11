import React from "react";

import styles from "./styles.module.scss";

const PlayerGender = (props) => {
  const { playerDetails } = props;

  return (
    <div className={styles["player-account-details-container"]}>
      <div className={styles["title-container"]}>
        <h4>Cinsiyet</h4>
        <p>
          Bu bilgi liderlik tablosundaki veri bütünlüğünü korumak amacıyla
          değiştirilememektedir.
        </p>
        <p>
          Değişiklik yapmak için lütfen{" "}
          <span className={styles.email}>merhaba@raket.com</span> e-posta adresi
          üzerinden iletişime geçin.
        </p>
      </div>
      <p className={styles.gender}>{playerDetails?.[0]?.gender}</p>
    </div>
  );
};

export default PlayerGender;
