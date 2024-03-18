import React, { Dispatch, SetStateAction } from "react";

import PlayerRegisterForm from "../../../components/register/player/PlayerRegisterForm";

interface PlayerRegisterProps {
  setUserType: Dispatch<SetStateAction<string>>;
}
const PlayerRegister = (props: PlayerRegisterProps) => {
  const { setUserType } = props;
  return (
    <div>
      <PlayerRegisterForm setUserType={setUserType} />
    </div>
  );
};
export default PlayerRegister;
