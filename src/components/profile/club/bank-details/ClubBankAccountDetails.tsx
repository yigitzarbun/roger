import React from "react";

import styles from "./styles.module.scss";

const ClubBankAccountDetails = () => {
  return (
    <div className={styles["club-bank-details-container"]}>
      <h2>Kart ve Ödeme Bilgileri</h2>
      <p>Kayıtlı Kart Sayısı: 2</p>
      <p>Aktif Kart: **** 7099</p>
      <p>Ödenen Toplam Miktar: 320 TL</p>
    </div>
  );
};

export default ClubBankAccountDetails;
