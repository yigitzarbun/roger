import styles from "./styles.module.scss";

const PlayerAccountDetails = () => {
  return (
    <div className={styles["player-account-details-container"]}>
      <h2>Hesap Bilgileri</h2>
      <p>İsim: Ahmet Aksoy</p>
      <p>E-posta: ahmetaksoy@gmail.com</p>
      <p>Yaş: 30</p>
      <p>Cinsiyet: Erkek</p>
      <p>Konum: Kadıköy</p>
      <p>Seviye: Başlangıç</p>
    </div>
  );
};

export default PlayerAccountDetails;
