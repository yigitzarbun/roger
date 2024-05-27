import React, { useState } from "react";

import CommonRegisterNav from "../../../components/register/common/CommonRegisterNav";
import PlayerRegister from "../player/PlayerRegister";
import TrainerRegister from "../trainer/TrainerRegister";
import ClubRegister from "../club/ClubRegister";

import styles from "./styles.module.scss";

const RegisterForm = () => {
  const [userType, setUserType] = useState("player");
  return (
    <div className={styles["register-container"]}>
      <CommonRegisterNav setUserType={setUserType} userType={userType} />
      {userType === "player" && <PlayerRegister setUserType={setUserType} />}
      {userType === "trainer" && <TrainerRegister setUserType={setUserType} />}
      {userType === "club" && <ClubRegister setUserType={setUserType} />}
    </div>
  );
};

export default RegisterForm;
