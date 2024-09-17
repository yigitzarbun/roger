import React, { Dispatch, SetStateAction } from "react";
import ClubRegisterForm from "../../../components/register/club/ClubRegisterForm";

interface ClubRegisterProps {
  setUserType: Dispatch<SetStateAction<string>>;
}
const TrainerRegister = (props: ClubRegisterProps) => {
  const { setUserType } = props;
  return (
    <div>
      <ClubRegisterForm setUserType={setUserType} />
    </div>
  );
};
export default TrainerRegister;
