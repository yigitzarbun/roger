import React from "react";
import styles from "./styles.module.scss";
import RegisterPage from "../../components/register/RegisterPage";

const Register = () => {
  return (
    <div className={styles["register-container"]}>
      <RegisterPage />
    </div>
  );
};
export default Register;
