import React, { useState } from "react";

import CommonRegisterNav from "../../components/register/common/CommonRegisterNav";
import PlayerRegister from "./player/PlayerRegister";
import TrainerRegister from "./trainer/TrainerRegister";
import ClubRegister from "./club/ClubRegister";

import styles from "./styles.module.scss";

const Register = () => {
  const [userType, setUserType] = useState("");
  return (
    <div className={styles["register-container"]}>
      {userType === "" && <CommonRegisterNav setUserType={setUserType} />}
      {userType === "player" && <PlayerRegister setUserType={setUserType} />}
      {userType === "trainer" && <TrainerRegister setUserType={setUserType} />}
      {userType === "club" && <ClubRegister setUserType={setUserType} />}
      {userType !== "" && (
        <button
          onClick={() => setUserType("")}
          className={styles["change-user-type-button"]}
        >
          {userType === "player"
            ? "Yanlış yerde misin? Kulüp veya eğitmen olarak kayıt ol"
            : userType === "club"
            ? "Yanlış yerde misin? Oyuncu veya eğitmen olarak kayıt ol"
            : "Yanlış yerde misin? Oyuncu veya kulüp olarak kayıt ol"}
        </button>
      )}
    </div>
  );
};

export default Register;
