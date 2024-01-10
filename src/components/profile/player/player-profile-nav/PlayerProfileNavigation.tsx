import React from "react";
import styles from "./styles.module.scss";
const PlayerProfileNavigation = () => {
  return (
    <div className={styles.nav}>
      <h4>Hesap</h4>
      <h4>Kişisel</h4>
      <h4>Genel</h4>
      <h4>Ödeme</h4>
      <h4>Diğer</h4>
    </div>
  );
};
export default PlayerProfileNavigation;
