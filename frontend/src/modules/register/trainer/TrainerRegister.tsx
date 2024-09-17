import React, { Dispatch, SetStateAction } from "react";
import TrainerRegisterForm from "../../../components/register/trainer/TrainerRegisterForm";

interface TrainerRegisterProps {
  setUserType: Dispatch<SetStateAction<string>>;
}
const TrainerRegister = (props: TrainerRegisterProps) => {
  const { setUserType } = props;
  return (
    <div>
      <TrainerRegisterForm setUserType={setUserType} />
    </div>
  );
};
export default TrainerRegister;
